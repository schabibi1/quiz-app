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
    <div>
      <h2>Quiz</h2>
      <div>
        <input
          type="text"
          placeholder="Enter player name (e.g., Quiz Wizard)"
          onBlur={(e) => addPlayer(e.target.value)}
        />
      </div>

      {/* dynamically render Qs & answers */}
      {questions.length > 0 && currentPlayer && (
        <div>
          <h3>{currentPlayer}'s Turn</h3>
          <form onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div key={question.id}>
                <h4>{question.question}</h4>
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
            ))}
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {/* display scores (all players) */}
      <div>
        <h3>Scores</h3>
        {players.length > 0 && (
          <ul>
            {players.map((player) => (
              <li key={player.name}>
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
    </div>
  );
};

export default Quiz;