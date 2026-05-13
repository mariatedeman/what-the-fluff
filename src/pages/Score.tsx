import { Layout } from "../components/layout/Layout";
import { ScoreBoardRow } from "../components/ScoreBoardRow";

import { useHighscoresWithUsers } from "../hooks/useHighscores";

export default function Score() {
  const { highscores, loading, error } = useHighscoresWithUsers();

  if (loading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
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

            <ScoreBoardRow placement={1} name="Maria" score={22}>
            </ScoreBoardRow>
            <ScoreBoardRow placement={2} name="Maria" score={20}>
            </ScoreBoardRow>
            <ScoreBoardRow placement={3} name="Maria" score={19}>
            </ScoreBoardRow>
            <ScoreBoardRow placement={4} name="Maria" score={15}>
            </ScoreBoardRow>
            <ScoreBoardRow placement={5} name="Maria" score={12}>
            </ScoreBoardRow>
        </Layout>
    )
}