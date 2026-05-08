import { useHighscoresWithUsers } from "../hooks/useHighscores";

export default function Score() {
  const { highscores, loading, error } = useHighscoresWithUsers();

  if (loading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Score</h1>

      <ul>
        {highscores.map((entry) => (
          <li key={entry.id}>
            {entry.users.name} – {entry.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
