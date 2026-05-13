import { Layout } from "../components/layout/Layout";
import { ScoreBoardRow } from "../components/ScoreBoardRow";
import type { ScoreProps } from "../models/Types";

export default function Score({ children }: ScoreProps) {
    return (
        <Layout>
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