'use client'
import Quiz from "./quiz/page"
// import QuizPoc from "./quiz-poc/page"

function App() {
  return (
    <main className="container mx-auto px-4">
      <article className="flex flex-col space-y-20 items-center justify-center py-2">
        <section>
          <h1 className="text-center text-5xl font-black my-6">Quiz Game App</h1>
          <p className="text-center text-xl font-semibold text-white/60">Take turns to choose correct answers to score high!</p>
        </section>
        <Quiz />
        {/* <QuizPoc /> */}
      </article>
    </main>
  )
}

export default App;