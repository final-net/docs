# Documentation project instructions

## About this project

- This is the integrator documentation for Final, built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- `openapi.public.json` is generated in `final-net/Final` and synced here; never edit it by hand
- Every claim on every page must match the code on `main` of `final-net/Final`. Verify a route, field, enum or error code there before writing it

## Terminology

- "Balance", capitalized, is the resource; a sub-balance is a Balance under a root
- "connection" is one install's credential on a grant; "grant" is what the user approved
- "publishable key" and "secret key" are the two credentials; never "API key" on its own
- "test mode" and "live mode", two words, never "sandbox"
- Assets are CAIP-19 identifiers; a ticker such as USDe is display only
- "user" is the person who approves; "integrator" is the company building on Final
- No customer or partner product name appears in a page. Redirect examples use `yourapp://final/return` and `https://app.example.com/final/return`

## Style preferences

- Second person, present tense, short sentences
- Sentence case for headings
- No em dashes. Use a comma, a colon, parentheses or a second sentence
- A page says what to do and the one consequence that matters, and nothing about how Final works inside
- Prefer Mintlify components (`<Steps>`, `<CodeGroup>`, `<Note>`, `<Warning>`) to prose
- Every code sample is a `<CodeGroup>` of Kotlin, Swift and curl, in that order
- Amounts in samples are smallest-unit integer strings; USDe has 9 decimals, so `"1000000000"` is 1 USDe
- Hosts: API `https://api.final.com/v1`, app `https://final.com`
- Code formatting for routes, fields, error codes and headers

## Content boundaries

- Document the integrator surface only: what `openapi.public.json` carries
- Do not describe internal mechanisms, partners or operations
- Do not document session-only dashboard features beyond what the setup page needs
