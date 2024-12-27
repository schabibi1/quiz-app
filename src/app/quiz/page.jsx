import { useState } from 'react';

const QuizForm = () => {
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find((a) => a.question_id === questionId);
      console.log('existingAnswer: ', existingAnswer);
      
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

      const data = await response.json();
      setScore(data.score);
      setCorrectAnswers(data.correctAnswers);
      setWrongAnswers(data.wrongAnswers);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h3>Q1: How many planets are in our solar system?</h3>
          <select
            onChange={(e) =>
              handleAnswerChange('a6d7a14c-58f0-4f33-9bf9-92580b6e1aa3', e.target.value)
            }
          >
            <option value="4c19daac-3069-4f78-93c3-950d44ab2d74">6</option>
            <option value="1939dd41-d73e-4bc8-bea3-c53d094eff66">8 Correct one</option>
          </select>
        </div>

        <div>
          <h3>Q2: Which 'The Lord of the Rings' movie has the highest IMDb rating?</h3>
          <select
            onChange={(e) =>
              handleAnswerChange('2dd95c9b-a7fe-47a8-8f78-a92caf3de955', e.target.value)
            }
          >
            <option value="bcc2909e-3b24-4b25-b2da-311ad4102dcf">The Fellowship of the Ring</option>
            <option value="7ad7c745-af78-4d02-b4fa-4e2d3608d176">The Return of the King, Correct one</option>
          </select>
        </div>

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

export default QuizForm;