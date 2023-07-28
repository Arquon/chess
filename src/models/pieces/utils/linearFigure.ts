import Figure from "@/models/main/figure";
import { type IPossibleAction, type IMoveInfo } from "@/types/IMove";

export type THorizontalDirections = "left" | "right";
export type TVerticalDirections = "forward" | "backward";
export type TLinearDirections = THorizontalDirections | TVerticalDirections;

export abstract class LinearFigure extends Figure {
   findAllLinearActions(): IPossibleAction[] {
      const protectionDirection = this.isShieldForKing();

      let allActions: IPossibleAction[] = [];

      const leftMoves: IMoveInfo[] = this.getHorizontalMoves("left");
      const rightMoves: IMoveInfo[] = this.getHorizontalMoves("right");
      const forwardMoves: IMoveInfo[] = this.getVerticalMoves("forward");
      const backwardMoves: IMoveInfo[] = this.getVerticalMoves("backward");

      switch (protectionDirection) {
         case false:
            allActions = [
               ...leftMoves.map((move) => ({ ...move, possible: true })),
               ...rightMoves.map((move) => ({ ...move, possible: true })),
               ...forwardMoves.map((move) => ({ ...move, possible: true })),
               ...backwardMoves.map((move) => ({ ...move, possible: true })),
            ];
            break;
         case "forward-left":
         case "forward-right":
         case "backward-left":
         case "backward-right":
            allActions = [
               ...leftMoves.map((move) => ({ ...move, possible: false })),
               ...rightMoves.map((move) => ({ ...move, possible: false })),
               ...forwardMoves.map((move) => ({ ...move, possible: false })),
               ...backwardMoves.map((move) => ({ ...move, possible: false })),
            ];
            break;
         case "forward":
         case "backward":
            allActions = [
               ...leftMoves.map((move) => ({ ...move, possible: false })),
               ...rightMoves.map((move) => ({ ...move, possible: false })),
               ...forwardMoves.map((move) => ({ ...move, possible: true })),
               ...backwardMoves.map((move) => ({ ...move, possible: true })),
            ];
            break;
         case "left":
         case "right":
            allActions = [
               ...leftMoves.map((move) => ({ ...move, possible: true })),
               ...rightMoves.map((move) => ({ ...move, possible: true })),
               ...forwardMoves.map((move) => ({ ...move, possible: false })),
               ...backwardMoves.map((move) => ({ ...move, possible: false })),
            ];
            break;
      }

      return allActions;
   }

   getHorizontalMoves(side: THorizontalDirections): IMoveInfo[] {
      const horizontalSideMoves: IMoveInfo[] = [];
      const edge = side === "left" ? 0 : 7;
      const stepDelX = side === "left" ? -1 : 1;
      let delX = 0;
      while (this.position.x + delX !== edge) {
         delX += stepDelX;
         const possibleMove = this.board.getCellByPosition({ x: this.position.x + delX, y: this.position.y });
         if (possibleMove instanceof Figure) {
            horizontalSideMoves.push({
               position: possibleMove.position,
               info: possibleMove.figureColor !== this.figureColor ? "capture" : "attackWithoutMove",
               figure: this,
            });
            break;
         }
         horizontalSideMoves.push({ position: possibleMove.position, figure: this });
      }

      return horizontalSideMoves;
   }

   getVerticalMoves(side: TVerticalDirections): IMoveInfo[] {
      const verticalSideMoves: IMoveInfo[] = [];
      const edge = side === "backward" ? 0 : 7;
      const stepDelY = side === "backward" ? -1 : 1;
      let delY = 0;
      while (this.position.y + delY !== edge) {
         delY += stepDelY;
         const possibleMove = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });
         if (possibleMove instanceof Figure) {
            verticalSideMoves.push({
               position: possibleMove.position,
               info: possibleMove.figureColor !== this.figureColor ? "capture" : "attackWithoutMove",
               figure: this,
            });
            break;
         }
         verticalSideMoves.push({ position: possibleMove.position, figure: this });
      }

      return verticalSideMoves;
   }
}
