'use client'
import { useEffect, useState } from 'react';
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

function Quiz() {
  return (
  <NhostProvider nhost={nhost}>
    <QuizHome />
  </NhostProvider>
  );
}

const QuizHome = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const { data } = await nhost.graphql.request(getQuiz);
        console.log('data: ', data);

        // Check data structure before mutate them
        if (data?.questions) {
          setQuestions(data.questions);
        } else {
          console.error("Quiz data is missing questions");
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };
    fetchQuiz();
  }, []);

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find((a) => a.question_id === questionId);
      
      if (existingAnswer) {
        existingAnswer.answer_id = answerId;
      } else {
        prevAnswers.push({ question_id: questionId, answer_id: answerId });
      }
      console.log('prevAnswers: ', prevAnswers);
      return [...prevAnswers];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ solutions: answers }),
      });
      console.log('response: ', response); 
      console.log('answers: ', answers);

      if (!response.ok) {
        throw new Error('Error submitting answers.');
      }

      const responseData = await response.json();
      setScore(responseData.score);
      setCorrectAnswers(responseData.correctAnswers);
      setWrongAnswers(responseData.wrongAnswers);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Quiz</h2>
      <form onSubmit={handleSubmit}>
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id}>
              <h3>{question.question}</h3>
              {question.answers?.map((answer) => (
                <div key={answer.id}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={answer.id}
                      onChange={() => handleAnswerChange(question.id, answer.id)}
                    />
                    {answer.answer}
                  </label>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Loading questions...</p>
        )}
        <button type="submit">Submit</button>
      </form>

      {score !== null && (
        <div>
          <h3>Your Score: {score}</h3>
          <h4>Correct Answers:</h4>
          <ul>
            {correctAnswers.map((answer) => (
              <li key={answer.question_id}>{answer.question_id}</li>
            ))}
          </ul>
          <h4>Wrong Answers:</h4>
          <ul>
            {wrongAnswers.map((answer) => (
              <li key={answer.question_id}>{answer.question_id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Quiz;