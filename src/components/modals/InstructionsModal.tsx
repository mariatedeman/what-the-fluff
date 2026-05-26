import { Button } from "../Buttons";
import { Typography } from "../Typography";
import { Modal } from "./Modal";

interface InstructionsModalProps {
  onClose: () => void;
}

export function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <Modal className="inset-0 m-auto w-[90%] max-w-sm h-[80vh] sm:h-auto rounded-2xl overflow-hidden">
      {/* Scrollable text container to ensure layout integrity on small screens */}
      <div className="w-full overflow-y-auto flex flex-col items-center pr-1 max-h-[calc(80vh-100px)] sm:max-h-none">
        <Typography
          text={"Instructions"}
          font="main"
          size={3}
          color="green"
          className="mb-6 w-full text-center"
        />

        {/* Rule 1: Point scoring mechanic */}
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
          className="pb-4 text-center"
        />

        {/* Rule 2: Color matching and grid management mechanic */}
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
          className="pb-4 text-center"
        />

        {/* Rule 3: Hazards and lose conditions */}
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
          className="pb-4 text-center"
        />
      </div>

      <Button variant="secondary" onClick={onClose} className="mt-6 w-full">
        Close
      </Button>
    </Modal>
  );
}
