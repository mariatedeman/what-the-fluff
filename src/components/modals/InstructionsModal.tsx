import { Button } from "../Buttons";
import { Typography } from "../Typography";
import { Modal } from "./Modal";

interface InstructionsModalProps {
  onClose: () => void;
}

export function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <Modal
      onClose={onClose}
      className="mx-4 w-full sm:max-w-md"
    >

        <Typography text={"Instructions"} color="green" type="h2"/>
        
        <Typography text={"Catch and Collect"} color="white" className="font-bold" size={0}/>
        <Typography text={"Gather the falling cotton candy to rack up points and build your stack. Catch 100 to win!"} color="white" size={0}/>
        
        <Typography text={"Match Colors"} color="white" className="font-bold pt-4" size={0}/>
        <Typography text={"Stack three of the same color in a row to pop them, clear space, and keep the game going."} color="white" size={0}/>

        <Typography text={"Watch the Skies"} color="white" className="font-bold pt-4" size={0}/>
        <Typography text={"Avoid the raindrops—no one likes rain at the tivoli! Keep your stack from reaching the top, or it's Game Over."} color="white" size={0}/>
      
      <Button variant="secondary" onClick={onClose} className="mt-6 w-full">
        Close
      </Button>
      </Modal>
      
  );
}
