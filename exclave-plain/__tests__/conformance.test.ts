/**
 * `@noy-db/exclave-plain` against the published conformance kit.
 *
 * This is the run that makes the `exclave-` prefix mean something. The kit
 * asserts the prefix rule FROM THE PACKAGE NAME: a capsule called `exclave-*`
 * must refuse `authenticate` and `seal`, and one called `enclave-*` must
 * support them. Without this run the prefix would be a naming convention; with
 * it, `npm ls` tells an auditor whether a build stores plaintext.
 *
 * The same kit runs against `enclave-aes` inside hub. One definition of the
 * contract, two implementations measured by it — which is the only arrangement
 * where "conforms" means the same thing for both.
 */
import { describe, it, expect } from 'vitest'
import { runCapsuleConformance, assertGroupRefuses, type ConformanceGroup } from '@noy-db/ports/capsule'
import * as exclave from '../src/index.js'

runCapsuleConformance(exclave as never, { name: '@noy-db/exclave-plain' })

// ⚠️ runCapsuleConformance checks the prefix posture, not the optional groups;
// per-group refusal lives in the kit's enclave cases. Asking it here is what
// catches a MIXED group — one primitive silently working while its siblings
// refuse (family#168).
describe('every refused group refuses as a whole', () => {
  const refused: readonly ConformanceGroup[] = ['sealing', 'deterministic', 'per-record-keys', 'classify']
  for (const group of refused) {
    it(`${group}: every primitive refuses`, async () => {
      expect(exclave.capabilities().has(group)).toBe(false)
      expect(await assertGroupRefuses(exclave as never, group)).toEqual([])
    })
  }
})
