import { applyMixins } from "@/utils/functions";

import { DiagonalFigure } from "./utils/diagonalFigure";
import { LinearFigure } from "./utils/linearFigure";
import Figure, { EFigures, type IFigure } from "../main/figure";
import { type TMoveInfoWithoutTransformation } from "@/types/MoveInfo";
import { type IQueenMoveInfo } from "@/types/moves/CommonMoveInfo";

interface IQueen extends IFigure {
   figureName: EFigures.queen;
}

interface Queen extends LinearFigure, DiagonalFigure {}

class Queen extends Figure implements IQueen {
   figureName: EFigures.queen = EFigures.queen;
   allActions: IQueenMoveInfo[] = [];

   findPossibleMoves(): IQueenMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const linearPossibleMoves = this.findLinearPossibleMoves(protectionDirection);
      const diagonalPossibleMoves = this.findDiagonalPossibleMoves(protectionDirection);
      const possibleMoves = [...linearPossibleMoves, ...diagonalPossibleMoves];
      const possibleQueenMoves: IQueenMoveInfo[] = possibleMoves.map((move) => ({ ...move, figure: { ...move.figure, type: EFigures.queen } }));
      this.possibleMoves = possibleQueenMoves;
      return possibleQueenMoves;
   }

   findAllActions(): TMoveInfoWithoutTransformation[] {
      const allLinearActions = this.findAllLinearActions();
      const allDiagonalActions = this.findAllDiagonalActions();
      const allActions = [...allLinearActions, ...allDiagonalActions];
      const allQueenActions: IQueenMoveInfo[] = allActions.map((move) => ({ ...move, figure: { ...move.figure, type: EFigures.queen } }));
      this.allActions = allQueenActions;
      return allQueenActions;
   }
}

applyMixins(Queen, [LinearFigure, DiagonalFigure]);

export default Queen;
