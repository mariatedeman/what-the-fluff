import Button from "../components/Button";
import Modal from "../components/Modal";
import GetUsers from "../components/TestStuff";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Button to="/game"> To Game </Button>
      <GetUsers/>
      <Modal />
    </div>
  );
}
