'use client'
import { useEffect, useState } from "react";
import { NhostProvider } from "@nhost/nextjs";
import { nhost } from './lib/nhost'

const getQuiz = `
  query {
    questions {
      question
      id
      answers {
        answer
        id
      }
    }
  }
`;

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <Home />
    </NhostProvider>
  );
}

function Home() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      const { data, error } = await nhost.graphql.request(getQuiz);

      setQuestions(data.questions);
      setAnswers(data.questions.answers);
      setLoading(false);
    }

    fetchQuestions();
  }, []);

  return (
    <main>
      <article>
        <section>
          <h1>Quiz Game App</h1>
          <h2>Rules</h2>
          <p>Have fun to play with anyone! Choose correct answers to score high and brag about it!</p>
        </section>
          
        <section>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {questions.map((singleQuestion, index) => (
                <>
                  <li key={singleQuestion.id}>Q: {singleQuestion.question}</li>
                  {singleQuestion.answers.map((singleAnswer) => {
                    return (
                      <>
                        <li key={singleAnswer.id}>{singleAnswer.answer}</li>
                      </>
                    )
                  })}
                </>
              ))}
            </ul>
          )}
        </section>
      </article>
    </main>
  );
}

export default App;