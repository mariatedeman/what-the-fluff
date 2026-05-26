import { Button } from "../components/Buttons";
import { Typography } from "../components/Typography";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <Typography type="h1" text={404} color="pink" size={5}/>
      <Typography type="p" text={"Page not found"} size={1} />
      <Button variant="primary" href="/" className="mt-8">
        Go to home
      </Button>
    </div>
  );
}
