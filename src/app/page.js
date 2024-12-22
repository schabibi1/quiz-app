'use client'
import QuizSelection from "./components/QuizSelection"

function App() {
  return (
    <main>
      <article>
      <h1 className="text-3xl font-bold underline">
        👋👋👋👋
      </h1>
        <section>
          <h1>Quiz Game App</h1>
          <h2>Rules</h2>
          <p>Have fun to play with anyone! Choose correct answers to score high!</p>
        </section>
        <QuizSelection />
      </article>
    </main>
  )
}

export default App;