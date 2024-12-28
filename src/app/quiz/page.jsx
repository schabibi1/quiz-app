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
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const { data } = await nhost.graphql.request(getQuiz);

        // check data structure before mutate them
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

      if (!response.ok) {
        throw new Error('Error submitting answers.');
      }

      const responseData = await response.json();
      if (!responseData) {
        throw new Error('No data returned');
      }

      // update player's score & results
      setPlayers((prevPlayers) => {
        return prevPlayers.map(player => {
          if (player.name === currentPlayer) {
            // return new player obj & avoid mutating state directly
            return {
              ...player,
              score: responseData.score,
              correctAnswers: responseData.correctAnswers,
              wrongAnswers: responseData.wrongAnswers
            };
          }
          return player;
        });
      });

      // clear answers for next player & reset current player
      setAnswers([]);
      // reset current player after submission
      setCurrentPlayer(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // add new player (Player 1, Player 2, etc.)
  const addPlayer = (name) => {
    // add a player & update players state immutably
    setPlayers((prevPlayers) => [
      ...prevPlayers, 
      { name, score: 0, correctAnswers: [], wrongAnswers: [] }
    ]);
    setCurrentPlayer(name);
  };

  return (
    <section className="flex flex-col space-y-4 w-full mb-8">
      {/* display scores (all players) */}
      <div>
        <h2 className="text-2xl font-semibold text-white my-6">Scores</h2>
        {players.length > 0 && (
          <ul>
            {players.map((player) => (
              <li className="text-xl font-semibold text-white/60" key={player.name}>
                {player.name}: {player.score} points
                <br />
                Correct Answers: {player.correctAnswers.length}
                <br />
                Wrong Answers: {player.wrongAnswers.length}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>
          <input
            type="text"
            placeholder="Enter player name (e.g., Quiz Wizard)"
            onBlur={(e) => addPlayer(e.target.value)}
            className="w-full py-4 pl-5 ml-0 space-x-2 border-2 cursor-pointer border-white/10 rounded-xl"
          />
        </label>
      </div>

      {/* dynamically render Qs & answers */}
      {questions.length > 0 && currentPlayer && (
        <div className="flex flex-col space-y-4 w-full mb-8">
          <h3 className="text-xl font-semibold text-white/60">
            {currentPlayer}'s Turn
          </h3>
          <form onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div
                className="flex flex-col space-y-4 w-full"
                key={question.id}
              >
                <h4 className="text-2xl font-semibold text-white my-6">
                  {question.question}
                </h4>
                {question.answers?.map((answer) => (
                  <div key={answer.id}>
                    <label className="flex items-center w-full py-4 pl-5 ml-0 space-x-2 border-2 cursor-pointer border-white/10 rounded-xl bg-white/5 hover:bg-white/15">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer.id}
                        onChange={() => handleAnswerChange(question.id, answer.id)}
                        className="w-6 h-6"
                      />
                      {answer.answer}
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500/75 hover:bg-indigo-500 rounded-lg font-semibold my-6"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Quiz;