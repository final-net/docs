@AGENTS.md

# Internal instructions

This repository is public. `AGENTS.md` holds the writing rules for anyone. This file holds the rules for how the team works on the docs.

## Source of truth

- Every claim on every page must match the code on `main` of `final-net/Final`. Verify a route, field, enum, error code, limit or UI label there before you write it. Read `origin/main`, not a working tree or a feature branch
- `openapi.public.json` comes from `make genspec` in `apps/api` of `final-net/Final`. Operation summaries and descriptions are in `apps/api/cmd/genspec/operations.go`. Field descriptions are the `description:"…"` struct tags on the Go types. Fix spec text there, never in this repository
- `snippets/objects/*.mdx` is generated from the spec by `node scripts/gen-objects.mjs`. Do not edit it by hand. `reference/objects/*.mdx` is hand-written
- Setup page labels come from `apps/ui/src/routes/temporary/integrator-setup/+page.svelte`
- Document a feature only after it is on `main`. A feature in an open pull request does not go on a page yet

## Content boundaries

- Document the integrator surface only: what `openapi.public.json` contains
- Do not describe internal mechanisms, partners or operations. This includes partner names and the word "partner" in prose. API field names such as `partner_auth_id` stay as they are
- No customer or partner product name appears in a page
- Do not document session-only dashboard features beyond what the setup page needs
- Do not state exact internal tuning values, such as a burst size, unless the page needs them for the reader to act

## Before you finish an edit

Check every line that you wrote or changed against the ASD-STE100 rules in `AGENTS.md`. This includes table cells, frontmatter `description`, step titles and callouts:

- No sentence over 25 words, and no instruction over 20 words
- No semicolons that join two facts, no em dashes, no contractions, no "we"
- No word from the "Not" column of the dictionary, and every dictionary verb in its one meaning
- No -ing word as a noun or a verb outside a technical name
- Every sentence names its actor and is in the active voice

Then check the structure:

- If you rename a heading, update every link to its anchor
- If you move or rename a page, update `docs.json` and every link, and add a redirect in `docs.json`
- Every internal link and anchor resolves
