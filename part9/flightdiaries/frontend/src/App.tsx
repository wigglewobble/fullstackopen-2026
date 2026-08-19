import { useState, useEffect } from 'react';
import axios from 'axios';
import type { DiaryEntry, Weather, Visibility, NewDiaryEntry } from './types';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('great');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    axios.get<DiaryEntry[]>('/api/diaries')
      .then(response => {
        setDiaries(response.data);
      })
      .catch((error: unknown) => {
        console.error('Error fetching diaries:', error);
      });
  }, []);

  const handleAddDiary = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');

    const newDiary: NewDiaryEntry = {
      date,
      visibility,
      weather,
      comment: comment.trim() ? comment : undefined
    };

    try {
      const response = await axios.post<DiaryEntry>('/api/diaries', newDiary);
      setDiaries(prev => prev.concat(response.data));
      // Clear form inputs
      setDate('');
      setVisibility('great');
      setWeather('sunny');
      setComment('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const data = error.response.data;
          if (data && typeof data === 'object' && 'error' in data) {
            const errPayload = data as { error: unknown };
            if (Array.isArray(errPayload.error)) {
              // Zod validation errors
              const messages = errPayload.error
                .map(issue => {
                  if (issue && typeof issue === 'object' && 'message' in issue) {
                    return String(issue.message);
                  }
                  return 'Unknown validation issue';
                })
                .join(', ');
              setErrorMsg(messages);
            } else {
              setErrorMsg(String(errPayload.error));
            }
          } else {
            setErrorMsg(error.message);
          }
        } else {
          setErrorMsg(error.message);
        }
      } else {
        setErrorMsg('An unexpected error occurred');
      }
    }
  };

  const weatherOptions: Weather[] = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];
  const visibilityOptions: Visibility[] = ['great', 'good', 'ok', 'poor'];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Add new entry</h2>
      
      {errorMsg && (
        <div style={{ color: 'red', marginBottom: '1em', fontWeight: 'bold' }}>
          Error: {errorMsg}
        </div>
      )}

      <form onSubmit={handleAddDiary} style={{ marginBottom: '2em' }}>
        <div style={{ marginBottom: '1em' }}>
          <label style={{ display: 'inline-block', width: '100px', fontWeight: 'bold' }}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '1em' }}>
          <span style={{ display: 'inline-block', width: '100px', fontWeight: 'bold' }}>Visibility</span>
          {visibilityOptions.map(option => (
            <label key={option} style={{ marginRight: '1em' }}>
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={() => setVisibility(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: '1em' }}>
          <span style={{ display: 'inline-block', width: '100px', fontWeight: 'bold' }}>Weather</span>
          {weatherOptions.map(option => (
            <label key={option} style={{ marginRight: '1em' }}>
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={() => setWeather(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: '1em' }}>
          <label style={{ display: 'inline-block', width: '100px', fontWeight: 'bold' }}>Comment</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button type="submit" style={{ padding: '0.5em 1.5em', cursor: 'pointer' }}>Add</button>
      </form>

      <hr />

      <h2>Diary entries</h2>
      {diaries.map(diary => (
        <div key={diary.id} style={{ marginBottom: '1.5em' }}>
          <h3>{diary.date}</h3>
          <div>visibility: {diary.visibility}</div>
          <div>weather: {diary.weather}</div>
          {diary.comment && <div>comment: {diary.comment}</div>}
        </div>
      ))}
    </div>
  );
};

export default App;
