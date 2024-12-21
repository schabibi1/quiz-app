'use client'
import { useEffect, useState } from "react";
import { NhostProvider } from "@nhost/nextjs";
import { nhost } from '../lib/nhost'

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

function QuizSelection() {
  return (
	<NhostProvider nhost={nhost}>
	  <QuizHome />
	</NhostProvider>
  );
}

function QuizHome() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
	async function fetchQuestions() {
	  setLoading(true);
	  const { data, error } = await nhost.graphql.request(getQuiz);

    // console.log(data.questions);
	  setQuestions(data.questions);
	  setAnswers(data.questions);
	  setLoading(false);
	}

	fetchQuestions();
  }, []);

  const quizAnswers = answers.map((a) => {
    const answerList = a.answers.map((answer) => answer.answer);
    const answerId = a.answers.map((answer) => answer.id);
    return (
      <li key={answerId}>{answerList}</li>
    )
  })

  const quizQuestions = questions.map((question) => {
    return (
      <li key={question.id}>Quiz: {question.question}</li>
    )
  })


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
            {quizQuestions}
            {quizAnswers}
          </ul>
          )}
        </section>
      </article>
    </main>
  );
}

export default QuizSelection;