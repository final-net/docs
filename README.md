# docs.final.com

The integrator documentation for Final, built on [Mintlify](https://mintlify.com). Pages are MDX files with YAML frontmatter; navigation and theme live in `docs.json`.

## Run it locally

Install the Mintlify CLI once:

```
npm i -g mint
```

Then, from this directory:

```
mint dev
```

The preview is at `http://localhost:3000`. If a page loads as a 404, check that you are running where `docs.json` is. If the CLI misbehaves, `mint update` brings it to the current release.

## Where the API reference comes from

`openapi.public.json` is generated, not written here. It is produced by `make genspec` in `apps/api` of `final-net/Final` and published to this repository by that repository's `docs-sync` workflow on every merge to `main`, as a pull request onto the `sync/openapi-spec` branch. Edit the Go operation table there; never edit the JSON here, since the next sync overwrites it.

The prose pages are written here, against the code on `main` of `final-net/Final`. A page claim that drifts from the code is a bug in this repository.

## Publishing

The site deploys from the default branch on every push. Files under `drafts/` and any `*.draft.mdx` are kept out of the build by `.mintignore`.
