import { type ICellPosition } from "@/types/cell/TCellNumbers";
import { type EColors } from "@/types/cell/ECellColors";
import type Board from "../main/board";
import { LinearFigure } from "./utils/linearFigure";
import { EFigures, type IFigure } from "../main/figure";
import { type TMoveInfo } from "@/types/MoveInfo";

interface IRock extends IFigure {
   wereMoved: boolean;
   figureName: EFigures.rock;
}

export default class Rock extends LinearFigure implements IRock {
   wereMoved: boolean;
   figureName: EFigures.rock = EFigures.rock;

   constructor(position: ICellPosition, color: EColors, board: Board, wereMoved: boolean = false) {
      super(position, color, board);
      this.wereMoved = wereMoved;
   }

   findPossibleMoves(): TMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const possibleMoves = this.findLinearPossibleMoves(protectionDirection);
      this.possibleMoves = possibleMoves;
      return possibleMoves;
   }

   findAllActions(): TMoveInfo[] {
      const allActions = this.findAllLinearActions();
      this.allActions = allActions;
      return allActions;
   }
}
