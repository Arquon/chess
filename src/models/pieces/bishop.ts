import { DiagonalFigure, type IDiagonalFigure } from "./utils/diagonalFigure";
import { EFigures } from "../main/figure";
import { type TMoveInfo } from "@/types/MoveInfo";

interface IBishop extends IDiagonalFigure {
   figureName: EFigures.bishop;
}

export default class Bishop extends DiagonalFigure implements IBishop {
   figureName: EFigures.bishop = EFigures.bishop;

   findPossibleMoves(): TMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const possibleMoves = this.findDiagonalPossibleMoves(protectionDirection);
      this.possibleMoves = possibleMoves;
      return possibleMoves;
   }

   findAllActions(): TMoveInfo[] {
      const allActions = this.findAllDiagonalActions();
      this.allActions = allActions;
      return allActions;
   }
}
