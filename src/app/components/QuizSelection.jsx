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
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [players, setPlayers] = useState([
    { name: 'Player 1', score: 0 },
    { name: 'Player 2', score: 0 },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

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
  const currentQuizInfo = answers[currentQuestionIndex];
  const correctAnswer = rightAnswers[currentQuestionIndex].correctAnswer;
  const currentPlayer = players[currentPlayerIndex];

  const handleSubmitAnswer = () => {
    if (selectedAnswer === correctAnswer) {
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += 1;

      setPlayers(updatedPlayers);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  if (quizCompleted) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        {players.map((player, index) => (
          <p key={index}>
            {player.name}: {player.score} / {questions.length}
          </p>
        ))}
      </div>
    );
  }

  return (
    <section>
      {loading ? (
        <p>Loading...</p>
      ) : (
      <div>
        <h2>Quiz: {currentQuestion.question}</h2>
        <p>Player: {currentPlayer.name}</p>
          <div>
            {currentQuizInfo.answers.map((a) => (
              <label key={a.id}>
                <input
                  type="radio"
                  name="answer"
                  value={a.answer}
                  checked={selectedAnswer === a.answer}
                  onChange={() => handleAnswerSelect(a.answer)}
                />
                {a.answer}
              </label>
            ))}
          </div>
        <button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
          Next
        </button>
      </div>
      )}
    </section>
  );
}

export default QuizSelection;