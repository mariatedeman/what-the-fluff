import { Button } from "../components/Buttons";
import TextInput from "../components/TextInput";
import { Layout } from "../components/layout/Layout";

export default function Home() {
    return (
        <>
            <h1>Home</h1>
            
            <Layout>

            <section className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <TextInput>
                        Name
                    </TextInput>
                    <TextInput>
                        API key
                    </TextInput>
                </div>

                <div className="flex">
                    <Button 
                        width="small"
                        variant="primary" 
                        type="button" 
                        href="/game"
                    >
                            Play game
                    </Button>
                    <Button 
                        width="small"
                        variant="secondary" 
                        type="submit" 
                        onClick={() => console.log("Click")}
                    >
                            Scoreboard
                    </Button>
                </div>
            </section>
            </Layout>
        </>
    )
}