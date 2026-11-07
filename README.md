# Diwali Dumb Charades

A Hindi / English dumb charades game for Diwali night, styled after the party invite.

- Enter the players, pick how many teams, and the app shuffles everyone into teams (rename them if you like).
- Each turn shows who's acting and for which team. Hit **Start the timer** (or press Enter) for a 3-2-1 count-in.
- The actor sees one word at a time: Hinglish, Devanagari and English, with an illustration and its category.
- **Space** = guessed correctly (next word), **→** or **S** = pass, **P** / **Esc** = pause, **M** = mute.
  On phones and tablets, tap the big buttons instead.
- After each turn you get a recap. Tap any word to fix a wrong call before the points are added.
- 100 words in 4 levels (Very Easy → Difficult). Level 4 words can score 2 points, and you can make each
  round harder than the last.
- The game is saved in the browser, so a refresh doesn't lose the scores.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

For party night, a production build is snappier:

```bash
npm run build && npm start
```

## Deploy on Vercel

Import the repo at vercel.com/new. It's a standard Next.js app, so no settings need changing.

## Editing the word list

All words live in `lib/words.ts`, one per line:

```
Hinglish|English|Devanagari|illustration emoji|Category
```
