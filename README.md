# `@noy-db/*` capsules — alternative record engines for noy-db

A **capsule** is the engine that turns a record into what a store holds. `@noy-db/hub` ships one:
`enclave-aes` (AES-256-GCM, zero-knowledge), and it needs no configuration. **Most apps never
install anything from this repo.**

This repo holds the alternatives, bound to the published `@noy-db/hub/capsule` port:

| package | what it does |
|---|---|
| `@noy-db/exclave-plain` | ⛔ **no encryption** — rows stored readable, with MAC-bound integrity, for tables other tools read and write where access control lives outside the database (IAM, VPC, a DB grant) |

⚠️ **An exclave turns zero-knowledge OFF.** Installing one moves the security boundary out of
noy-db and into your store. Read the package README before you do.

## Binding — at build time, never at runtime

A capsule is swapped in for hub's own enclave through hub's `#capsule` import map, selected by a
**resolution condition** in your bundler:

```js
// vite.config.js  (esbuild/webpack take the same shape)
export default { resolve: { conditions: ['noy-db:exclave-plain'] } }
```

```bash
npm i @noy-db/hub @noy-db/exclave-plain
```

Each capsule declares `@noy-db/hub` as a caret-ranged **peer** and imports hub **only** at
`@noy-db/hub/capsule` — hub's root imports the capsule, so importing hub's root back would be a
cycle.

## Develop

```bash
pnpm install && pnpm build && pnpm test && pnpm lint && pnpm typecheck && pnpm typecheck:test
```

Every capsule runs the shared conformance kit (`@noy-db/ports/capsule`) and checks its exports
against the surface of the **installed** hub's default enclave, so a hub that adds a name fails
here, not in a consumer's install.

Extracted from the `noy-db/core` monorepo on 2026-09-29. Main repository:
[noy-db/core](https://github.com/noy-db/core).

## License

Apache-2.0
