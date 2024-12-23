# nhost Quiz App
A multiplayer quiz app powered by nhost, Next.js and AWS Lambda.
Two players can play on the same machine's browser to answer by taking turns. Scores will display when all answers were selected.

![Screenshot of the quiz app](https://asset.cloudinary.com/dsmeebz8b/c121b3f774927fc06fe4211e8c6da115)

## Prerequisite environment
- npm: 10.8.2
- node: 20.18.0
- React: ^18
- Next.js: 14.2.21

> [!WARNING]
> Next.js version should be lower than Next 15 to prevent getting an incompatibility from [nhost Next.js client library](https://docs.nhost.io/reference/nextjs/nhost-client).

## Run a quiz app
1. Install dependencies.

```bash
npm i
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- `app/page.js`is the wrapper of the main quiz component.
- `app/components/QuizSelection.js` is the main quiz component.

> [!WARNING]
> `feat/style` branch has style implemented. `feat/submit-solution-serverside` branch is without styling. Planning on deleting `feat/submit-solution-serverside` branch and merge `feat/style` branch to `main` branch.

## Requirements Achievement
- [x] Use Next.js
- [x] https://github.com/schabibi1/nhost-quiz-app/pull/1
- [x] https://github.com/schabibi1/nhost-quiz-app/pull/2
- [x] Local multiplayer mode on a single machine
- [x] Use nhost SDK to fetch data (GET, dedicated subdomain and the region. Utilize GraphQL playground.)
- [x] Track each player's score & display it on the UI
- [x] Instruction on README
- [ ] Use nhost SDK to submit solution (POST) to serverside Lambda function (`nhost.functions.call()` & a dedicated `evaluate` endpint)


## Additional Features
- [x] Responsive design (Style: Tailwind CSS)
- [x] Mobile-first UI design for maintainability
- [x] Accessiblity (100 scores in Lighthouse and 0 issues in axe DevTools.)

## Future Improvements

- [ ] TypeScript support
- [ ] Use nhost SDK to submit solution (POST) to serverside Lambda function (`nhost.functions.call()` & a dedicated `evaluate` endpint)
- [ ] Replace static correct answer array object to dynamic data interacting with `evaluate` endpoint from a serverside function
- [ ] Player name editing feature (Passing with props from `Page` to `QuizSelection` enables this feature)
- [ ] Dark mode & light mode switch option
- [ ] Mobile event-supported style (i.e. Tapped component style change on tap.)
- [ ] "Reset" or "Play again" button to go back to the home screen
- [ ] Add more players functionality
- [ ] Quiz progress bar UI
- [ ] Count down timer
- [ ] "Previous" button to go back & update the previous quesion's answer