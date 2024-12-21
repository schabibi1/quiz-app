'use client'
import { useEffect, useState } from "react";
import { NhostProvider } from "@nhost/nextjs";
import { nhost } from './lib/nhost'

const getQuestions = `
  query {
    questions {
      question
      answers {
        answer
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

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      const { data, error } = await nhost.graphql.request(getQuestions);

      setQuestions(data.questions);
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
                <li key={index}>
                  <p>Q: {singleQuestion.question}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </main>
  );
}

export default App;