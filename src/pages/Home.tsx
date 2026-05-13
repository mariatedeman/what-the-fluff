import { Button } from "../components/Buttons";
import TextInput from "../components/TextInput";
import { Layout } from "../components/layout/Layout";

export default function Home() {
    return (
        <>           
            <Layout>

                <section className="flex flex-col self-center gap-4 w-3xs">
                    <div className="flex flex-col">
                        <TextInput>
                            Name
                        </TextInput>
                        <TextInput>
                            API key
                        </TextInput>
                    </div>

                    <div className="flex flex-col">
                        <Button 
                            variant="primary" 
                            type="button" 
                            href="/game"
                        >
                                Play game
                        </Button>
                        <Button 
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