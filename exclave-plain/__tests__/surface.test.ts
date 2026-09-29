/**
 * The binding contract: hub's capsule door names ~97 values and imports them
 * from `#capsule`. If this package is missing even one, a consumer who sets
 * the `noy-db:exclave-plain` condition gets a module-resolution failure at
 * import time — in THEIR install, not in our CI.
 *
 * ⚠️ THE SURFACE IS READ FROM HUB, not copied. A copied list would drift the
 * moment hub adds an export, and the drift would be invisible here and fatal
 * there. This is the same reason the conformance kit exists: the contract has
 * one definition or it has none.
 *
 * ⭐ Since this package left core (2026-09-29) there is no hub SOURCE beside
 * it, so the surface is read from the INSTALLED hub: the module its own
 * `imports["#capsule"].default` names — the enclave a consumer gets when no
 * condition is set. That is the artefact a consumer's bundler swaps us in
 * for, which makes it a stricter witness than core's checked-in golden.
 * Measured at extraction: hub@0.9.0's default capsule exports the same 100
 * names as core's `enclave-surface.golden.json`.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as exclave from '../src/index.js'

const hubManifestPath = createRequire(import.meta.url).resolve('@noy-db/hub/package.json')
const hubManifest = JSON.parse(readFileSync(hubManifestPath, 'utf8')) as {
  imports: Record<string, Record<string, string>>
}
const defaultCapsule = hubManifest.imports['#capsule']!.default!
const door = (await import(
  pathToFileURL(join(dirname(hubManifestPath), defaultCapsule)).href
)) as Record<string, unknown>
const golden = { values: Object.keys(door) }

describe('exclave-plain satisfies hub\'s capsule surface', () => {
  it('exports every value the door names', () => {
    const mine = new Set(Object.keys(exclave))
    const missing = golden.values.filter(name => !mine.has(name))
    expect(missing).toEqual([])
  })

  it('exports nothing the door does not name', () => {
    // Not pedantry: an extra export here is a name hub will not re-export, so
    // it is dead weight in the published artefact and a false promise to
    // anyone who finds it.
    const expected = new Set(golden.values)
    const extra = Object.keys(exclave).filter(name => !expected.has(name))
    expect(extra).toEqual([])
  })
})
