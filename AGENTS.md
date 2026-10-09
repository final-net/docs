# Documentation project instructions

## About this project

- This is the integrator documentation for Final, built on [Mintlify](https://mintlify.com)
- Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json`
- `openapi.public.json` is generated and synced here; never edit it by hand

## Terminology

- "Balance", capitalized, is the resource; a sub-balance is a Balance under a root
- "connection" is one install's credential on a grant; "grant" is what the user approved
- "publishable key" and "secret key" are the two credentials; never "API key" on its own
- "test mode" and "live mode", two words, never "sandbox"
- Assets are CAIP-19 identifiers; a ticker such as USDe is display only
- "user" is the person who approves; "integrator" is the company building on Final
- Redirect examples use `yourapp://final/return` and `https://app.example.com/final/return`

## Style preferences

The prose follows the main rules of ASD-STE100 (Simplified Technical English).

- Write only what the reader needs to act. No lead-ins, no recaps, no "simply" or "just"
- Say what to do and the one consequence that matters, never how Final works inside
- Write full sentences, with a subject, a verb and the articles ("a", "the"). No fragments, also in table cells, except where the cell is a name or a value
- One topic per sentence. An instruction has 20 words or fewer; a description has 25 words or fewer. Do not join two facts with a semicolon: write two sentences
- Write instructions as commands, one action each. Put a condition first: "If the request fails, send it again"
- Use the active voice. Name the actor (you, the user, Final). Not "the address is withheld", but "Final does not show the address". Never "we"
- Use only the simple tenses: present, past and future. Second person. No contractions
- Do not use a word that ends in -ing as a noun or a verb, except in a technical name ("routing window", "test mode"). Not "Reading the address opens a window", but "When you read the address, Final opens a routing window"
- Use one word for one meaning, from the dictionary below. Use words in their literal meaning: no idioms and no metaphors ("money lives on", "gets a say", "a pure read")
- Use noun clusters of three words or fewer
- Prefer a table, a list or a `<Steps>` block to a paragraph. A paragraph has two or three sentences at most
- Headings and page titles are in sentence case, and are commands or noun phrases ("Revoke a connection", "Rate limits")
- No em dashes. Use a comma, a colon, parentheses or a second sentence

## Dictionary

Technical names. Use these, and no synonym for them:

- Final's resources: Balance, root Balance, sub-balance, grant, connection, intent, card, deposit, deposit instructions, routing window, routing default, receipt, landing (an arrival on chain before the credit), swap, event, webhook, gate
- Credentials and modes: publishable key, secret key, key pair, test mode, live mode
- UI labels, written as the UI shows them in bold: **Mint pair**, **Approve**

Technical verbs, with their one meaning:

| Use | Meaning | Not |
| --- | --- | --- |
| return | The API sends back a response or a status | answer, give back, hand |
| create | Make a new resource | mint (except the **Mint pair** label), spawn, issue |
| contain | A response or object has a field or value | carry, hold, include |
| send | Make a request, or send funds | fire, hit, post (as a verb) |
| read | Make a `GET` request | fetch, pull |
| open, close | Start or stop a routing window or a stream, or show a URL or page | claim, release |
| replace | Put a new value in place of the old one | overwrite |
| revoke | End a connection or a grant | kill, sign out |
| arrive | Funds come to an address on chain | land |
| credit | Final adds funds to a Balance | |
| be in | Funds are in a Balance | live on, sit on |
| use | Operate a tool, key or field for a purpose | leverage, utilize |

## Page conventions

- Every quickstart step ends with a `<Check>` saying what the reader should see
- Code samples: the app quickstart and app-specific pages use a `<CodeGroup>` of Kotlin and Swift; the server quickstart uses curl; shared pages use Kotlin, Swift and curl, in that order
- Amounts in samples are smallest-unit integer strings; USDe has 9 decimals, so `"1000000000"` is 1 USDe
- Hosts: API `https://api.final.com`, app `https://final.com`. Paths have no version prefix: the version goes in the `Final-Version` header
- Code formatting for routes, fields, error codes and headers
