# qwick-refactor

Just a qwick exercise

## Notes

Remember [these](https://www.magiceye.com/)? When I was a kid, magic eye books would
show up in class all the time. There was always a bunch of other kids getting
excited about it. And the rule was not to tell anyone what the hidden image is,
so you don't spoil the surprise.

I could never do them. To this day I still can't.

Thank you for this exercise. With this undoubtedly one of a kind code snippet,
I think I finally know the satisfaction my classmates all seemed to be getting
staring at those patterns cross-eyed, while I just got a headache.

## Process

On first glance I recognized that this was going to take careful focus, but
I hit a few surprises along the way. Notably, this was challenging in more
and different ways than I expected.

I set out initially to identify and remove any
algebraic redundancies. If I could find and apply small behavior-preserving
transformations by substition like the ones I learned in
[The Little Prover](https://mitpress.mit.edu/9780262527958/the-little-prover/)
until I was as close to evaluated normal form as possible, it might make
my task of reading much easier.

To keep me honest, I started with a simple property test. Essentially:

```
forall randomArrayOfStrings.

doStuffAndThings(randomArrayOfStrings) ==
copyOfDoStuffAndThings(randomArrayOfStrings)
```

I set the minimum successful runs to 50K, so for less than a second wait
I could get pretty strong verification about the behavior-preserving
aspect of each change I made to my copy of the function.

I renamed that copy to `simplified`.

As I got clearer on what the function was actually doing, I considered
ways to better tune the generation of my test inputs so they better
exercised the different edge cases that could arise.

I hit a few cycles where tuning my test inputs surfaced gaps in my
understanding and I iterated on my simplification process.

Eventually I got to the point where I had millions of verifications
piled up that my simplification was behavior perserving, and
the quirky algorithm underneath this Jackson Pollock of a function was pretty
clear to me. When I could explain it in simple words,
I translated it to `cleanedUp` and locked
both new versions of the code to the original `doStuffAndThings` in my property test.
