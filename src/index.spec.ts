import { testProp, fc } from 'ava-fast-check';
import * as fn from 'fp-ts/function'
import * as ROA from 'fp-ts/ReadonlyArray'
import * as str from 'fp-ts/string'
import { cleanedUp, doThingsAndStuff, simplified } from './index';

const orUndef = <A>(arb: fc.Arbitrary<A>): fc.Arbitrary<A | undefined> => 
  fc.oneof(fc.constant(undefined), arb, arb, arb, arb)

const space = fc.integer({min: 1, max: 4}).map(x => [...new Array(x)].map(_ => ' ').join(''))

const wSpaces = fc.string({maxLength: 5}).chain(p => fc.string().chain(s => space.map(sp => `${p}${sp}${s}`)))

const wPrefixes = wSpaces.map(x => fn.pipe(x, str.split(''), ROA.scanLeft('', (acc, char) => `${acc}${char}`)))

const strs = fc.oneof(wSpaces, wSpaces, fc.string({maxLength: 5}))

testProp.serial('preserve original behavior', [
  fc.array(orUndef(strs).noShrink(), { minLength: 3, maxLength: 10 }).noShrink(),
  wPrefixes,
  fc.array(orUndef(strs).noShrink(), { minLength: 3, maxLength: 10 }).noShrink()
], (t, p, m, s) => {
  const strs = [...p, ...m, ...s]
  const strs2 = strs.slice(0)
  doThingsAndStuff(strs2)
  t.deepEqual(strs2, simplified(strs))
  t.deepEqual(strs2, cleanedUp(strs))
}, { numRuns: 50000 });
