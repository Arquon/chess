import Figure from "@/models/main/figure";
import { type IPossibleAction, type IMoveInfo } from "@/types/IMove";

export type TDiagonalDirections = "forward-right" | "backward-right" | "backward-left" | "forward-left";

export abstract class DiagonalFigure extends Figure {
   findAllDiagonalActions(): IPossibleAction[] {
      const protectionDirection = this.isShieldForKing();

      let allActions: IPossibleAction[] = [];

      const forwardLeftMoves: IMoveInfo[] = this.getDiagonalMoves("forward-left");
      const forwardRightMoves: IMoveInfo[] = this.getDiagonalMoves("forward-right");
      const backwardLeftMoves: IMoveInfo[] = this.getDiagonalMoves("backward-left");
      const backwardRightMoves: IMoveInfo[] = this.getDiagonalMoves("backward-right");

      switch (protectionDirection) {
         case false:
            allActions = [
               ...forwardLeftMoves.map((move) => ({ ...move, possible: true })),
               ...forwardRightMoves.map((move) => ({ ...move, possible: true })),
               ...backwardLeftMoves.map((move) => ({ ...move, possible: true })),
               ...backwardRightMoves.map((move) => ({ ...move, possible: true })),
            ];
            break;
         case "forward":
         case "backward":
         case "left":
         case "right":
            allActions = [
               ...forwardLeftMoves.map((move) => ({ ...move, possible: false })),
               ...forwardRightMoves.map((move) => ({ ...move, possible: false })),
               ...backwardLeftMoves.map((move) => ({ ...move, possible: false })),
               ...backwardRightMoves.map((move) => ({ ...move, possible: false })),
            ];
            break;
         case "forward-right":
         case "backward-right":
            allActions = [
               ...forwardLeftMoves.map((move) => ({ ...move, possible: false })),
               ...forwardRightMoves.map((move) => ({ ...move, possible: true })),
               ...backwardLeftMoves.map((move) => ({ ...move, possible: false })),
               ...backwardRightMoves.map((move) => ({ ...move, possible: true })),
            ];
            break;
         case "forward-left":
         case "backward-left":
            allActions = [
               ...forwardLeftMoves.map((move) => ({ ...move, possible: true })),
               ...forwardRightMoves.map((move) => ({ ...move, possible: false })),
               ...backwardLeftMoves.map((move) => ({ ...move, possible: true })),
               ...backwardRightMoves.map((move) => ({ ...move, possible: false })),
            ];
            break;
      }

      return allActions;
   }

   getDiagonalMoves(direction: TDiagonalDirections): IMoveInfo[] {
      const diagonalMoves: IMoveInfo[] = [];
      let stepDelX: number;
      let stepDelY: number;
      let edgeX: number;
      let edgeY: number;
      switch (direction) {
         case "forward-right":
            stepDelX = 1;
            stepDelY = 1;
            edgeX = 7;
            edgeY = 7;
            break;
         case "backward-right":
            stepDelX = 1;
            stepDelY = -1;
            edgeX = 7;
            edgeY = 0;
            break;
         case "backward-left":
            stepDelX = -1;
            stepDelY = -1;
            edgeX = 0;
            edgeY = 0;
            break;
         case "forward-left":
            stepDelX = -1;
            stepDelY = 1;
            edgeX = 0;
            edgeY = 7;
            break;
      }

      let delX = 0;
      let delY = 0;

      while (this.position.x + delX !== edgeX && this.position.y + delY !== edgeY) {
         delX += stepDelX;
         delY += stepDelY;
         const possibleMove = this.board.getCellByPosition({ x: this.position.x + delX, y: this.position.y + delY });
         if (possibleMove instanceof Figure) {
            diagonalMoves.push({
               position: possibleMove.position,
               info: possibleMove.figureColor !== this.figureColor ? "capture" : "attackWithoutMove",
               figure: this,
            });

            break;
         }
         diagonalMoves.push({ position: possibleMove.position, figure: this });
      }

      return diagonalMoves;
   }
}
