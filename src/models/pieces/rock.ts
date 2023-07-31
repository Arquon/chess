import { type ICellPosition } from "@/types/cell/TCellNumbers";
import { type EColors } from "@/types/cell/ECellColors";
import type Board from "../main/board";
import { LinearFigure } from "./utils/linearFigure";
import { type IMoveInfo } from "@/types/IMove";
import { EFigures, type IFigure } from "../main/figure";

interface IRock extends IFigure {
   wereMoved: boolean;
   figureName: EFigures.rock;
}

export default class Rock extends LinearFigure implements IRock {
   wereMoved: boolean;
   figureName: EFigures.rock = EFigures.rock;

   constructor(position: ICellPosition, color: EColors, board: Board) {
      super(position, color, board);
      this.wereMoved = false;
   }

   findPossibleMoves(): IMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const possibleMoves = this.findLinearPossibleMoves(protectionDirection);
      this.possibleMoves = possibleMoves;
      return possibleMoves;
   }

   findAllActions(): IMoveInfo[] {
      const allActions = this.findAllLinearActions();
      this.allActions = allActions;
      return allActions;
   }
}
