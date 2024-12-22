'use client'
import QuizSelection from "./components/QuizSelection"

function App() {
  return (
    <main>
      <article>
        <section>
          <h1>Quiz Game App</h1>
          <h2>Rules</h2>
          <p>Have fun to play with anyone! Choose correct answers to score high and brag about it!</p>
        </section>
        <QuizSelection />
      </article>
    </main>
  )
}

export default App;