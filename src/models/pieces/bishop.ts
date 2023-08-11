import { DiagonalFigure, type IDiagonalFigure } from "./utils/diagonalFigure";
import { EFigures } from "../main/figure";
import { type IBishopMoveInfo, type ICommonMoveInfoTemplate } from "@/types/moves/CommonMoveInfo";

interface IBishop extends IDiagonalFigure {
   figureName: EFigures.bishop;
}

export default class Bishop extends DiagonalFigure implements IBishop {
   figureName: EFigures.bishop = EFigures.bishop;
   allActions: IBishopMoveInfo[] = [];

   findPossibleMoves(): IBishopMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const possibleMoves: ICommonMoveInfoTemplate[] = this.findDiagonalPossibleMoves(protectionDirection);
      const possibleBishopMoves: IBishopMoveInfo[] = possibleMoves.map((move) => ({ ...move, figure: { ...move.figure, type: EFigures.bishop } }));
      this.possibleMoves = possibleBishopMoves;
      return possibleBishopMoves;
   }

   findAllActions(): IBishopMoveInfo[] {
      const allActions: ICommonMoveInfoTemplate[] = this.findAllDiagonalActions();
      const allBishopActions: IBishopMoveInfo[] = allActions.map((move) => ({ ...move, figure: { ...move.figure, type: EFigures.bishop } }));
      this.allActions = allBishopActions;
      return allBishopActions;
   }
}
