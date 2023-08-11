import Figure, { type TDirections, type IFigure } from "@/models/main/figure";
import { type ICommonMoveInfoTemplate } from "@/types/moves/CommonMoveInfo";

export type TDiagonalDirections = "forward-right" | "backward-right" | "backward-left" | "forward-left";

export interface IDiagonalFigure extends IFigure {
   findDiagonalPossibleMoves: (protectionDirection: TDirections | false) => ICommonMoveInfoTemplate[];
}

interface IDiagonalMoves {
   forwardLeftMoves: ICommonMoveInfoTemplate[];
   forwardRightMoves: ICommonMoveInfoTemplate[];
   backwardLeftMoves: ICommonMoveInfoTemplate[];
   backwardRightMoves: ICommonMoveInfoTemplate[];
}
export abstract class DiagonalFigure extends Figure implements IDiagonalFigure {
   private diagonalMoves: IDiagonalMoves = {
      forwardLeftMoves: [],
      forwardRightMoves: [],
      backwardLeftMoves: [],
      backwardRightMoves: [],
   };

   findDiagonalPossibleMoves(protectionDirection: TDirections | false): ICommonMoveInfoTemplate[] {
      const { forwardLeftMoves, forwardRightMoves, backwardLeftMoves, backwardRightMoves } = this.diagonalMoves;

      let possibleMoves: ICommonMoveInfoTemplate[] = [];

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

   findAllDiagonalActions(): ICommonMoveInfoTemplate[] {
      const forwardLeftMoves: ICommonMoveInfoTemplate[] = this.getDiagonalMoves("forward-left");
      const forwardRightMoves: ICommonMoveInfoTemplate[] = this.getDiagonalMoves("forward-right");
      const backwardLeftMoves: ICommonMoveInfoTemplate[] = this.getDiagonalMoves("backward-left");
      const backwardRightMoves: ICommonMoveInfoTemplate[] = this.getDiagonalMoves("backward-right");

      this.diagonalMoves = { forwardLeftMoves, forwardRightMoves, backwardLeftMoves, backwardRightMoves };

      return [...forwardLeftMoves, ...forwardRightMoves, ...backwardLeftMoves, ...backwardRightMoves];
   }

   getDiagonalMoves(direction: TDiagonalDirections): ICommonMoveInfoTemplate[] {
      const diagonalMoves: ICommonMoveInfoTemplate[] = [];
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
            diagonalMoves.push(move);
            break;
         }

         diagonalMoves.push(move);
      }

      return diagonalMoves;
   }
}
