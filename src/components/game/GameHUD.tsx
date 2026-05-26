import { InfoPlate } from "../InfoPlate";
import { Typography } from "../Typography";

interface GameHUDProps {
  playerName: string | undefined;
  caughtItems: number;
  highscore: number | null;
  isStudent: boolean;
}

export function GameHUD({
  playerName,
  caughtItems,
  highscore,
  isStudent,
}: GameHUDProps) {
  return (
    <InfoPlate className="flex-row h-22">
      {isStudent ? (
        <>
          <div className="w-1/3 min-w-0 flex justify-start">
            <Typography
              text={playerName ?? ""}
              size={1}
              font={"body"}
              color="white"
              className="block! justify-start! truncate w-full text-left"
            />
          </div>

          <Typography
            text={caughtItems}
            size={6}
            font={"main"}
            color="green"
            className="w-1/3 text-center"
          />

          <Typography
            text={`☆ ${highscore ?? caughtItems}p`}
            size={1}
            font={"body"}
            color="white"
            className="w-1/3 justify-end"
          />
        </>
      ) : (
        <>
          <div className="min-w-0 flex justify-start">
            <Typography
              text={playerName ?? ""}
              size={1}
              font={"body"}
              color="white"
            />
          </div>

          <Typography
            text={caughtItems}
            size={6}
            font={"main"}
            color="green"
          />
        </>
      )}
    </InfoPlate>
  );
}
