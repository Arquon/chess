import Figure, { type TDirections, type IFigure } from "@/models/main/figure";
import { type ICommonMoveInfoTemplate } from "@/types/moves/CommonMoveInfo";

export type THorizontalDirections = "left" | "right";
export type TVerticalDirections = "forward" | "backward";
export type TLinearDirections = THorizontalDirections | TVerticalDirections;

export interface ILinearFigure extends IFigure {
   findLinearPossibleMoves: (protectionDirection: TDirections | false) => ICommonMoveInfoTemplate[];
}

interface ILinearMoves {
   leftMoves: ICommonMoveInfoTemplate[];
   rightMoves: ICommonMoveInfoTemplate[];
   forwardMoves: ICommonMoveInfoTemplate[];
   backwardMoves: ICommonMoveInfoTemplate[];
}
export abstract class LinearFigure extends Figure implements ILinearFigure {
   private linearMoves: ILinearMoves = {
      leftMoves: [],
      rightMoves: [],
      forwardMoves: [],
      backwardMoves: [],
   };

   findLinearPossibleMoves(protectionDirection: TDirections | false): ICommonMoveInfoTemplate[] {
      const { leftMoves, rightMoves, forwardMoves, backwardMoves } = this.linearMoves;

      let possibleMoves: ICommonMoveInfoTemplate[] = [];

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

      return possibleMoves;
   }

   findAllLinearActions(): ICommonMoveInfoTemplate[] {
      const leftMoves: ICommonMoveInfoTemplate[] = this.getHorizontalMoves("left");
      const rightMoves: ICommonMoveInfoTemplate[] = this.getHorizontalMoves("right");
      const forwardMoves: ICommonMoveInfoTemplate[] = this.getVerticalMoves("forward");
      const backwardMoves: ICommonMoveInfoTemplate[] = this.getVerticalMoves("backward");

      this.linearMoves = {
         leftMoves,
         rightMoves,
         forwardMoves,
         backwardMoves,
      };

      return [...leftMoves, ...rightMoves, ...forwardMoves, ...backwardMoves];
   }

   getHorizontalMoves(side: THorizontalDirections): ICommonMoveInfoTemplate[] {
      const horizontalSideMoves: ICommonMoveInfoTemplate[] = [];
      const edge = side === "left" ? 0 : 7;
      const stepDelX = side === "left" ? -1 : 1;
      let delX = 0;
      while (this.position.x + delX !== edge) {
         delX += stepDelX;
         const possibleMove = this.board.getCellByPosition({ x: this.position.x + delX, y: this.position.y });
         const move: ICommonMoveInfoTemplate = {
            figure: {
               position: this.position,
            },
            info: {
               position: possibleMove.position,
            },
         };

         if (possibleMove instanceof Figure) {
            move.info.description = possibleMove.figureColor !== this.figureColor ? "capture" : "attackWithoutMove";
            horizontalSideMoves.push(move);
            break;
         }

         horizontalSideMoves.push(move);
      }

      return horizontalSideMoves;
   }

   getVerticalMoves(side: TVerticalDirections): ICommonMoveInfoTemplate[] {
      const verticalSideMoves: ICommonMoveInfoTemplate[] = [];
      const edge = side === "backward" ? 0 : 7;
      const stepDelY = side === "backward" ? -1 : 1;
      let delY = 0;
      while (this.position.y + delY !== edge) {
         delY += stepDelY;
         const possibleMove = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });
         const move: ICommonMoveInfoTemplate = {
            figure: {
               position: this.position,
            },
            info: {
               position: possibleMove.position,
            },
         };

         if (possibleMove instanceof Figure) {
            move.info.description = possibleMove.figureColor !== this.figureColor ? "capture" : "attackWithoutMove";
            verticalSideMoves.push(move);
            break;
         }
         verticalSideMoves.push(move);
      }

      return verticalSideMoves;
   }
}
