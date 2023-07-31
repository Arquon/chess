import { applyMixins } from "@/utils/functions";

import { DiagonalFigure } from "./utils/diagonalFigure";
import { LinearFigure } from "./utils/linearFigure";
import Figure, { EFigures, type IFigure } from "../main/figure";
import { type IMoveInfo } from "@/types/IMove";

interface IQueen extends IFigure {
   figureName: EFigures.queen;
}

interface Queen extends LinearFigure, DiagonalFigure {}

class Queen extends Figure implements IQueen {
   figureName: EFigures.queen = EFigures.queen;

   findPossibleMoves(): IMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const linearPossibleMoves = this.findLinearPossibleMoves(protectionDirection);
      const diagonalPossibleMoves = this.findDiagonalPossibleMoves(protectionDirection);
      const possibleMoves = [...linearPossibleMoves, ...diagonalPossibleMoves];
      this.possibleMoves = possibleMoves;
      return possibleMoves;
   }

   findAllActions(): IMoveInfo[] {
      const allLinearActions = this.findAllLinearActions();
      const allDiagonalActions = this.findAllDiagonalActions();
      const allActions = [...allLinearActions, ...allDiagonalActions];
      this.allActions = allActions;
      return allActions;
   }
}

applyMixins(Queen, [LinearFigure, DiagonalFigure]);

export default Queen;
