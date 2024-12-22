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

// Static answers for temporary testing
const rightAnswers = [
  {correctAnswer: "8"},
  {correctAnswer: "50"},
  {correctAnswer: "The Return of the King"},
  {correctAnswer: "Africa"},
  {correctAnswer: "Canberra"},
  {correctAnswer: "25"},
  {correctAnswer: "118"},
  {correctAnswer: "12 742 km"},
];

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);

      const { data, error } = await nhost.graphql.request(getQuiz);
      setQuestions(data.questions);
      setAnswers(data.questions);
      setLoading(false);
    }
    fetchQuestions();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentOptions = answers[currentQuestionIndex];
  const currentAnswer = rightAnswers[currentQuestionIndex].correctAnswer;
  
  const handleSubmitAnswer = () => {
    if (selectedAnswer === currentAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  if (quizCompleted) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>Your score: {score} / {questions.length}</p>
      </div>
    );
  }

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
          <div>
            <h2>{currentQuestion.question}</h2>
              <div>
                {currentOptions.answers.map((a) => {
                  return (
                    <label key={a.id}>
                      <input
                        type="radio"
                        name="answer"
                        value={currentOptions.answers.map((a) => a.answer)}
                        checked={selectedAnswer === currentOptions.answers.map((a) => a.answer)}
                        onChange={() => handleAnswerSelect(currentOptions.answers.map((a) => a.answer))}
                      />
                      {a.answer}
                    </label>
                  )
                })}
              </div>
            <button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
              Next
            </button>
          </div>
          )}
        </section>
      </article>
    </main>
  );
}

export default QuizSelection;