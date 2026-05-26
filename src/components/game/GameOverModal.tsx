import { useNavigate } from "react-router-dom";
import { Button } from "../Buttons";
import { Modal } from "../modals/Modal";
import { Typography } from "../Typography";
import type { TivoliPayoutResponse } from "../../types/edge";

interface GameOverModalProps {
  isStudent: boolean;
  isEligibleForPayout: boolean;
  payoutResult: TivoliPayoutResponse | null;
  stamp: { image_url?: string } | null;
}

export function GameOverModal({
  isStudent,
  isEligibleForPayout,
  payoutResult,
  stamp,
}: GameOverModalProps) {
    const navigate = useNavigate();

    return (
        <Modal className="inset-0 h-full">
            <Typography
              text={"Game Over"}
              type="span"
              font="main"
              size={5}
              color="pink"
            />

            {/* Display stamp and winnings */}
            {isStudent && (
              <>
                <Typography
                  text={
                    !isEligibleForPayout
                      ? "No win this time"
                      : payoutResult?.success
                        ? `Congratulations! You won €${payoutResult.data.amount}`
                        : payoutResult
                          ? "No win this time"
                          : "Processing winnings…"
                  }
                  type="span"
                  font="body"
                  size={0}
                  color="white"
                  className="pb-8 font-bold"
                />

                {stamp?.image_url ? (
                  <img
                    className="
                      rounded-3xl border-4 border-border border-dotted 
                      h-30 p-4 bg-white"
                    src={stamp.image_url}
                    alt="tivoli stamp"
                  />
                ) : (
                  <Typography
                    text="No stamp available"
                    type="span"
                    font="body"
                    size={0}
                    color="white"
                  />
                )}
              </>
            )}

            <Button
              variant="secondary"
              onClick={() => navigate("/score")}
              className="mt-8"
            >
              To scoreboard
            </Button>
          </Modal>
    )
}