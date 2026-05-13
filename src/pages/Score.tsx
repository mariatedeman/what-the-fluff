import { Layout } from "../components/layout/Layout";
import { ScoreBoard } from "../components/ScoreBoard";

export default function Score({ children }) {
    return (
        <Layout>
            <ScoreBoard placement={1} name="Maria" score={22}>
            </ScoreBoard>
            <ScoreBoard placement={2} name="Maria" score={20}>
            </ScoreBoard>
            <ScoreBoard placement={3} name="Maria" score={19}>
            </ScoreBoard>
            <ScoreBoard placement={4} name="Maria" score={15}>
            </ScoreBoard>
            <ScoreBoard placement={5} name="Maria" score={12}>
            </ScoreBoard>
        </Layout>
    )
}