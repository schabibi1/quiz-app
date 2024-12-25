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
// const rightAnswers = [
//   {correctAnswer: "8"},
//   {correctAnswer: "50"},
//   {correctAnswer: "The Return of the King"},
//   {correctAnswer: "Africa"},
//   {correctAnswer: "Canberra"},
//   {correctAnswer: "25"},
//   {correctAnswer: "118"},
//   {correctAnswer: "12 742 km"},
// ];

const initState = [
  {
    question_id: "",
    answer_id: "",
  }
]

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
  const [requestData, setRequestData] = useState(initState);

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
  // const correctAnswer = rightAnswers[currentQuestionIndex].correctAnswer;
  const currentPlayer = players[currentPlayerIndex];

  // // ⬇️ Commented out to test handleSubmit
  // const handleSubmitAnswer = async () => {
  //   if (selectedAnswer === correctAnswer) {
  //     const updatedPlayers = [...players];
  //     console.log(updatedPlayers);
      
  //     updatedPlayers[currentPlayerIndex].score += 1;

  //     setPlayers(updatedPlayers);
  //   }

  //   if (currentQuestionIndex < questions.length - 1) {
  //     setCurrentQuestionIndex(currentQuestionIndex + 1);
  //     setSelectedAnswer(null);
  //   } else {
  //     setQuizCompleted(true);
  //   }
  //   setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setRequestData in handleChange below mutates the requestData state
    console.log(requestData)

    const res = await fetch('http://localhost:3000/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requestData }),
    });

    // Returns the NextResponse.json() reponse from the POST route
    const result = await res.json();
    console.log(result);
  }

  const handleChange = (e) => {
    e.preventDefault();

    setRequestData((prevData) => {
      // TODO: Change input value -> answer ID
      // ✔️ Replacing existing element to mutate the original answer_id
      prevData.splice(0, 1, {
        question_id: '',
        answer_id: e.target.value
      });
      console.log('...prevData: ', ...prevData);
      
      return { ...prevData };
    })
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
                  name="answer"
                  // TODO: Change value to answer ID i.e. -> a.id
                  value={a.answer}
                  checked={selectedAnswer === a.answer}
                  onChange={() => handleAnswerSelect(a.answer)}
                  onClick = {handleChange}
                  className="w-6 h-6"
                />
                {a.answer}
              </label>
            ))}
          </div>
        <button
          // onClick={handleSubmitAnswer}
          onClick={handleSubmit}
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