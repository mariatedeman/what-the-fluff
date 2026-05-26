import { Button } from "../Buttons";
import { Typography } from "../Typography";
import { Modal } from "./Modal";

interface InstructionsModalProps {
  onClose: () => void;
}

export function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <Modal className="inset-0 m-auto h-full w-full sm:h-auto sm:w-auto">
      <Typography
        text={"Instructions"}
        font="main"
        size={3}
        color="green"
        className="mb-4"
      />
      <Typography
        text={"Catch and Collect"}
        font="body"
        size={0}
        color="white"
        className="font-bold"
      />
      <Typography
        text={
          "Gather the falling cotton candy to rack up points and build your stack. Catch 100 to win!"
        }
        font="body"
        size={0}
        color="white"
        className="pb-4"
      />
      <Typography
        text={"Match Colors"}
        font="body"
        size={0}
        color="white"
        className="font-bold"
      />
      <Typography
        text={
          "Stack three of the same color in a row to pop them, clear space, and keep the game going."
        }
        font="body"
        size={0}
        color="white"
        className="pb-4"
      />
      <Typography
        text={"Watch the Skies"}
        font="body"
        size={0}
        color="white"
        className="font-bold"
      />
      <Typography
        text={
          "Avoid the raindrops—no one likes rain at the tivoli! Keep your stack from reaching the top, or it's Game Over."
        }
        font="body"
        size={0}
        color="white"
      />

      <Button
        variant="secondary"
        onClick={onClose}
        className="m-8"
      >
        Close
      </Button>
    </Modal>
  );
}
