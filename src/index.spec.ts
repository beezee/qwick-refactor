import { testProp, fc } from 'ava-fast-check';
import { doThingsAndStuff, simplified } from './index';

const orUndef = <A>(arb: fc.Arbitrary<A>): fc.Arbitrary<A | undefined> => 
  fc.oneof(fc.constant(undefined), arb, arb, arb, arb)

const space = fc.integer({min: 1, max: 3}).map(x => [...new Array(x)].map(_ => ' ').join(''))

const wSpaces = fc.string({maxLength: 5}).chain(p => fc.string().chain(s => space.map(sp => `${p}${sp}${s}`)))

const strs = fc.oneof(wSpaces, wSpaces, fc.string({maxLength: 5}))

testProp.serial('preserve original behavior', [fc.array(orUndef(strs).noShrink(), { minLength: 3, maxLength: 10 }).noShrink()], (t, _strs) => {
  //const strs = ["`n P33}","jxQ3   !q('e@l~6","*C   9IC","?k'o!   m\"^I)gQd","","","}cT   5\\~E",undefined]
  //console.log(strs)
  const strs = _strs
  const strs2 = strs.slice(0)
  doThingsAndStuff(strs2)
  t.deepEqual(strs2, simplified(strs))
}, { numRuns: 50000 });
