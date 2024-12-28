'use client'
import Quiz from "./quiz/page"

function App() {
  return (
    <main className="container mx-auto px-4">
      <article className="flex flex-col items-center justify-center py-2">
        <section>
          <h1 className="text-center text-5xl font-black my-6">Quiz Game App</h1>
          <p className="text-center text-xl font-semibold text-white/60">Change player's name to your name when previous player compete the quiz!</p>
        </section>
        <Quiz />
      </article>
    </main>
  )
}

export default App;