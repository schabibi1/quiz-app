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

const initRequestState = [
  {
    question_id: "",
    answer_id: "",
  }
]

const initScoreState = {
  score: 0,
}

function Quiz() {
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
  const [requestData, setRequestData] = useState(initRequestState);
  const [scores, setScores] = useState(initScoreState);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);

      const { data } = await nhost.graphql.request(getQuiz);
      setQuestions(data.questions);
      setAnswers(data.questions);
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuizInfo = answers[currentQuestionIndex];
  // const correctAnswer = rightAnswers[currentQuestionIndex].correctAnswer;
  const currentPlayer = players[currentPlayerIndex];

  const handleSubmitAnswer = async () => {
    console.log('selectedAnswer: ', selectedAnswer);
    
    if (selectedAnswer !== null) {// 🚨 Review this condition
      const updatedPlayers = [...players];
      // updatedPlayers[currentPlayerIndex].score += 1;
      updatedPlayers[currentPlayerIndex].score = scores.score;
      setPlayers(updatedPlayers);
      setScores(scores.score);// Not mutating scores
      console.log('scores: ', scores);// TODO: Mutate scores
    }

    // // Temporary commented out to narrow down the error spot for Array.splice
    // if (currentQuestionIndex < questions.length - 1) {
    //   setCurrentQuestionIndex(currentQuestionIndex + 1);
    //   setSelectedAnswer(null);
    // } else {
    //   setQuizCompleted(true);
    // }
    // setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setRequestData in handleChange below mutates the requestData state
    console.log(requestData)

    const res = await fetch('http://localhost:3000/api/quiz', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([requestData]),
    });
    // returns the NextResponse.json() reponse from the POST route
    const result = await res.json();
    console.log('result: ', result);
  }

  const handleChange = (e) => {
    e.preventDefault();
    setRequestData((prevData) => {
      // // Replacing existing element to mutate the original answer_id
      // prevData.splice(0, 1, {
      //   question_id: currentQuestion.id,
      //   answer_id: e.target.value
      // });

      const updatedPrevData = Object.assign(prevData, {
        question_id: currentQuestion.id,
        answer_id: e.target.value
      });
      console.log('updatedPrevData: ', updatedPrevData);
      return updatedPrevData;
    });

    // Forcing to go to the next Q to narrow down the error spot
    // Copied from handleSubmitAnswer()
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
        <h2 className="text-2xl font-semibold text-white my-6">Quiz Completed!</h2>
        {players.map((player, index) => (
          <p
            key={index}
            className="text-xl font-semibold text-white/60"
          >
            {/* Update player.score (i.e. scores.score) */}
            {player.name}: {player.score} out of {questions.length}
          </p>
        ))}
      </div>
    );
  }

  return (
    <section>
      {loading ? (
        <p className="text-xl font-semibold text-white/60">Loading...</p>
      ) : (
      <div className="flex flex-col space-y-4 w-full mb-8">
        <p className="text-xl font-semibold text-white/60">Player: {currentPlayer.name}</p>
        <h2 className="text-2xl font-semibold text-white my-6">{currentQuestion.question}</h2>
          <div className="flex flex-col space-y-4 w-full">
            {currentQuizInfo.answers.map((a) => (
              <label className="flex items-center w-full py-4 pl-5 ml-0 space-x-2 border-2 cursor-pointer border-white/10 rounded-xl bg-white/5 hover:bg-white/15" key={a.id}>
                <input
                  type="radio"
                  name="answer_id"
                  value={a.id}
                  checked={selectedAnswer === a.id}
                  onChange={() => handleAnswerSelect(a.id)}
                  onClick={handleChange}
                  className="w-6 h-6"
                />
                {a.answer}
              </label>
            ))}
          </div>
        <button
          onSubmit={handleSubmit}
          // onClick={handleSubmitAnswer}
          disabled={!selectedAnswer || loading}
          className={!selectedAnswer ? "w-full py-3 bg-indigo-500/75 rounded-lg font-semibold my-6" : "w-full py-3 bg-indigo-500/75 hover:bg-indigo-500 rounded-lg font-semibold my-6"}
        >
          {loading ? 'Submitting...' : 'Next'}
        </button>
      </div>
      )}
    </section>
  );
}

export default Quiz;