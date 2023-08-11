import Figure, { type TDirections, type IFigure } from "@/models/main/figure";
import { type TMoveInfo } from "@/types/MoveInfo";

export type THorizontalDirections = "left" | "right";
export type TVerticalDirections = "forward" | "backward";
export type TLinearDirections = THorizontalDirections | TVerticalDirections;

export interface ILinearFigure extends IFigure {
   findLinearPossibleMoves: (protectionDirection: TDirections | false) => TMoveInfo[];
}

interface ILinearMoves {
   leftMoves: TMoveInfo[];
   rightMoves: TMoveInfo[];
   forwardMoves: TMoveInfo[];
   backwardMoves: TMoveInfo[];
}
export abstract class LinearFigure extends Figure implements ILinearFigure {
   private linearMoves: ILinearMoves = {
      leftMoves: [],
      rightMoves: [],
      forwardMoves: [],
      backwardMoves: [],
   };

   findLinearPossibleMoves(protectionDirection: TDirections | false): TMoveInfo[] {
      const { leftMoves, rightMoves, forwardMoves, backwardMoves } = this.linearMoves;

      let possibleMoves: TMoveInfo[] = [];

      switch (protectionDirection) {
         case false:
            possibleMoves = [...leftMoves, ...rightMoves, ...forwardMoves, ...backwardMoves];
            break;
         case "forward":
         case "backward":
            possibleMoves = [...forwardMoves, ...backwardMoves];
            break;
         case "left":
         case "right":
            possibleMoves = [...leftMoves, ...rightMoves];
            break;
      }

      this.possibleMoves = possibleMoves;
      return possibleMoves;
   }

   findAllLinearActions(): TMoveInfo[] {
      const leftMoves: TMoveInfo[] = this.getHorizontalMoves("left");
      const rightMoves: TMoveInfo[] = this.getHorizontalMoves("right");
      const forwardMoves: TMoveInfo[] = this.getVerticalMoves("forward");
      const backwardMoves: TMoveInfo[] = this.getVerticalMoves("backward");

      this.linearMoves = {
         leftMoves,
         rightMoves,
         forwardMoves,
         backwardMoves,
      };

      return [...leftMoves, ...rightMoves, ...forwardMoves, ...backwardMoves];
   }

   getHorizontalMoves(side: THorizontalDirections): TMoveInfo[] {
      const horizontalSideMoves: TMoveInfo[] = [];
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

   getVerticalMoves(side: TVerticalDirections): TMoveInfo[] {
      const verticalSideMoves: TMoveInfo[] = [];
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
