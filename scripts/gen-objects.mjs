// Generates snippets/objects/*.mdx from openapi.public.json, one per object
// the prose pages show. The pages import a snippet where they used to carry a
// hand-written JSON shape, and reference/objects/*.mdx renders the same
// snippet as the object's reference page, so neither can drift from the spec.
//
// Run `node scripts/gen-objects.mjs` after the spec changes; CI fails when the
// committed output is stale.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const spec = JSON.parse(readFileSync("openapi.public.json", "utf8"));
const schemas = spec.components.schemas;

// slug -> component. The slug is the snippet file and the export name's base.
const OBJECTS = {
  balance: "BalanceConnectionBalanceView",
  "limit-rule": "LimitsRuleUnion",
  "deposit-instruction": "BalanceDepositInstructionUnion",
  transaction: "BalanceTransactionView",
  "deposit-instructions": "BalanceDepositInstructionsResponse",
  "onchain-address-instruction": "BalanceOnchainAddressInstruction",
  "swap-instruction": "BalanceSwapViaInstruction",
  deposit: "DepositView",
  "deposit-receipt": "DirectdepositReceiptDTO",
  "deposit-receipts": "DirectdepositDepositReceiptsDTO",
  "deposit-routing": "DirectdepositRoutingDTO",
  "routing-window": "DirectdepositOverrideDTO",
  card: "CardView",
  "embed-url": "CardEmbedURLResponse",
  "test-authorization": "CardauthTestAuthorizationResponse",
  connection: "ConnectionView",
  grant: "ConnectionGrantView",
  intent: "IntentView",
  "connection-link": "ConnectionIntentLink",
  "exchange-rate": "ExchangerateResponse",
  asset: "AssetsAssetView",
  error: "HttpxAPIError",
};

const refName = (ref) => ref.replace("#/components/schemas/", "");
const slugOf = (component) => Object.entries(OBJECTS).find(([, c]) => c === component)?.[0];
// "Error" would shadow the global in the MDX module scope.
const exportName = (slug) =>
  slug === "error" ? "ErrorObject" : slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");

function typeOf(prop) {
  if (prop.$ref) return schemas[refName(prop.$ref)].title ?? refName(prop.$ref);
  if (prop.items) return `${typeOf(prop.items)}[]`;
  // A Go `any` field has no `type` in the spec, which would otherwise render as type="".
  const types = Array.isArray(prop.type) ? prop.type : prop.type ? [prop.type] : [];
  const named = types.filter((t) => t !== "null");
  const base = named.length ? named.join(" | ") : "object";
  return types.includes("null") ? `${base} | null` : base;
}

// The snippet body is JSX inside an exported component, where Markdown is not
// parsed, so links and code are emitted as elements.
const code = (v) => `<code>${v}</code>`;

function describe(prop) {
  const parts = [];
  if (prop.description) parts.push(prop.description);
  if (prop.enum?.length === 1) parts.push(`Always ${code(prop.enum[0])}.`);
  else if (prop.enum) parts.push(`One of ${prop.enum.map(code).join(", ")}.`);
  const target = prop.$ref ? refName(prop.$ref) : prop.items?.$ref ? refName(prop.items.$ref) : null;
  if (target) {
    const slug = slugOf(target);
    if (slug) parts.push(`See <a href="/reference/objects/${slug}">${schemas[target].title ?? target}</a>.`);
  }
  return parts.join(" ");
}

function fields(component, depth = 0) {
  const schema = schemas[component];
  if (schema.oneOf) {
    // A union renders one field per variant, named by its discriminator,
    // with the variant's own fields beneath it.
    return schema.oneOf
      .map((v) => {
        const target = refName(v.$ref);
        const variant = schemas[target];
        const discriminator = Object.values(variant.properties ?? {}).find((p) => p.enum?.length === 1)?.enum?.[0];
        const attrs = [`name="${discriminator ?? variant.title ?? target}"`, `type="object"`];
        return `<ResponseField ${attrs.join(" ")}>\n  ${variant.title ?? target}.\n  <Expandable title="fields">\n${indent(fields(target, depth + 1), 4)}\n  </Expandable>\n</ResponseField>`;
      })
      .join("\n\n");
  }
  const required = new Set(schema.required ?? []);
  return Object.entries(schema.properties)
    .map(([name, prop]) => {
      const attrs = [`name="${name}"`, `type="${typeOf(prop)}"`];
      if (required.has(name)) attrs.push("required");
      const body = describe(prop);
      // Inline the fields of a nested object that has no page of its own, one
      // level down, so a reader sees the shape without leaving the page.
      const target = prop.$ref ? refName(prop.$ref) : null;
      const inline = target && !slugOf(target) && (schemas[target].properties || schemas[target].oneOf) && depth <= 1;
      if (!inline) return `<ResponseField ${attrs.join(" ")}>\n  ${body}\n</ResponseField>`;
      return `<ResponseField ${attrs.join(" ")}>\n  ${body}\n  <Expandable title="fields">\n${indent(fields(target, depth + 1), 4)}\n  </Expandable>\n</ResponseField>`;
    })
    .join("\n\n");
}

const indent = (text, n) => text.split("\n").map((l) => (l ? " ".repeat(n) + l : l)).join("\n");

// The compact shape a guide page shows inline: the field names in order with a
// placeholder per type, so a reader sees the object at a glance and follows
// the link for the field descriptions. A union renders one block per variant.
function placeholder(prop, depth) {
  if (prop.$ref) {
    const target = refName(prop.$ref);
    const schema = schemas[target];
    if (schema.enum) return `"${schema.enum.join(" | ")}"`;
    if (!schema.properties || depth > 0) return "{ … }";
    return shape(target, depth + 1);
  }
  if (prop.items) return `[${placeholder(prop.items, depth)}]`;
  const types = Array.isArray(prop.type) ? prop.type : [prop.type];
  const nullable = types.includes("null");
  const base = prop.enum ? prop.enum.join(" | ") : types.filter((t) => t !== "null").join(" | ") || "object";
  return `"${nullable ? `${base} | null` : base}"`;
}

function shape(component, depth = 0) {
  const schema = schemas[component];
  const pad = "  ".repeat(depth + 1);
  const lines = Object.entries(schema.properties).map(([name, prop]) => `${pad}"${name}": ${placeholder(prop, depth)}`);
  return `{\n${lines.join(",\n")}\n${"  ".repeat(depth)}}`;
}

function shapeBlocks(component) {
  const schema = schemas[component];
  const variants = schema.oneOf ? schema.oneOf.map((v) => refName(v.$ref)) : [component];
  return variants
    .map((v) => "```json " + (schemas[v].title ?? v) + "\n" + shape(v) + "\n```")
    .join("\n\n");
}

mkdirSync("snippets/objects", { recursive: true });
for (const [slug, component] of Object.entries(OBJECTS)) {
  const schema = schemas[component];
  if (!schema) throw new Error(`${component} is not in openapi.public.json`);
  const header = `{/* Generated by scripts/gen-objects.mjs from openapi.public.json (${component}). Do not edit. */}`;
  writeFileSync(`snippets/objects/${slug}.mdx`, `${header}\n\nexport const ${exportName(slug)} = () => (\n  <>\n${indent(fields(component), 4)}\n  </>\n);\n`);
  writeFileSync(`snippets/objects/${slug}-shape.mdx`, `${header}\n\n${shapeBlocks(component)}\n`);
}
console.log(`wrote ${Object.keys(OBJECTS).length} object snippets and their shapes`);
