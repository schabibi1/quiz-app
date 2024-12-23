'use client'
import QuizSelection from "./components/QuizSelection"

function App() {
  return (
    <main className="container mx-auto px-4">
      <article className="flex flex-col space-y-20 items-center justify-center py-2">
        <section>
          <h1 className="text-center text-3xl font-medium my-6">Quiz Game App</h1>
          <p>Take turns to choose correct answers to score high!</p>
        </section>
        <QuizSelection />
      </article>
    </main>
  )
}

export default App;