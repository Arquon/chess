import Figure, { type TDirections, type IFigure } from "@/models/main/figure";
import { type TMoveInfo } from "@/types/MoveInfo";

export type TDiagonalDirections = "forward-right" | "backward-right" | "backward-left" | "forward-left";

export interface IDiagonalFigure extends IFigure {
   findDiagonalPossibleMoves: (protectionDirection: TDirections | false) => TMoveInfo[];
}

interface IDiagonalMoves {
   forwardLeftMoves: TMoveInfo[];
   forwardRightMoves: TMoveInfo[];
   backwardLeftMoves: TMoveInfo[];
   backwardRightMoves: TMoveInfo[];
}
export abstract class DiagonalFigure extends Figure implements IDiagonalFigure {
   private diagonalMoves: IDiagonalMoves = {
      forwardLeftMoves: [],
      forwardRightMoves: [],
      backwardLeftMoves: [],
      backwardRightMoves: [],
   };

   findDiagonalPossibleMoves(protectionDirection: TDirections | false): TMoveInfo[] {
      const { forwardLeftMoves, forwardRightMoves, backwardLeftMoves, backwardRightMoves } = this.diagonalMoves;

      let possibleMoves: TMoveInfo[] = [];

      switch (protectionDirection) {
         case false:
            possibleMoves = [...forwardLeftMoves, ...forwardRightMoves, ...backwardLeftMoves, ...backwardRightMoves];
            break;

         case "forward-right":
         case "backward-left":
            possibleMoves = [...forwardRightMoves, ...backwardLeftMoves];
            break;
         case "forward-left":
         case "backward-right":
            possibleMoves = [...forwardLeftMoves, ...backwardRightMoves];
            break;
      }

      return possibleMoves;
   }

   findAllDiagonalActions(): TMoveInfo[] {
      const forwardLeftMoves: TMoveInfo[] = this.getDiagonalMoves("forward-left");
      const forwardRightMoves: TMoveInfo[] = this.getDiagonalMoves("forward-right");
      const backwardLeftMoves: TMoveInfo[] = this.getDiagonalMoves("backward-left");
      const backwardRightMoves: TMoveInfo[] = this.getDiagonalMoves("backward-right");

      this.diagonalMoves = { forwardLeftMoves, forwardRightMoves, backwardLeftMoves, backwardRightMoves };

      return [...forwardLeftMoves, ...forwardRightMoves, ...backwardLeftMoves, ...backwardRightMoves];
   }

   getDiagonalMoves(direction: TDiagonalDirections): TMoveInfo[] {
      const diagonalMoves: TMoveInfo[] = [];
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
