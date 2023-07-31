import { DiagonalFigure, type IDiagonalFigure } from "./utils/diagonalFigure";
import { type IMoveInfo } from "@/types/IMove";
import { EFigures } from "../main/figure";

interface IBishop extends IDiagonalFigure {
   figureName: EFigures.bishop;
}

export default class Bishop extends DiagonalFigure implements IBishop {
   figureName: EFigures.bishop = EFigures.bishop;

   findPossibleMoves(): IMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const possibleMoves = this.findDiagonalPossibleMoves(protectionDirection);
      this.possibleMoves = possibleMoves;
      return possibleMoves;
   }

   findAllActions(): IMoveInfo[] {
      const allActions = this.findAllDiagonalActions();
      this.allActions = allActions;
      return allActions;
   }
}
