import { type ICellPosition } from "@/types/cell/TCellNumbers";
import { type EColors } from "@/types/cell/ECellColors";
import type Board from "../main/board";
import { LinearFigure } from "./utils/linearFigure";
import { EFigures, type IFigure } from "../main/figure";
import { type TMoveInfoWithoutTransformation } from "@/types/MoveInfo";
import { type ICommonMoveInfoTemplate, type IRockMoveInfo } from "@/types/moves/CommonMoveInfo";

interface IRock extends IFigure {
   wereMoved: boolean;
   figureName: EFigures.rock;
}

export default class Rock extends LinearFigure implements IRock {
   wereMoved: boolean;
   figureName: EFigures.rock = EFigures.rock;
   allActions: IRockMoveInfo[] = [];

   constructor(position: ICellPosition, color: EColors, board: Board, wereMoved: boolean = false) {
      super(position, color, board);
      this.wereMoved = wereMoved;
   }

   findPossibleMoves(): IRockMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const possibleMoves: ICommonMoveInfoTemplate[] = this.findLinearPossibleMoves(protectionDirection);
      const possibleRockMoves: IRockMoveInfo[] = possibleMoves.map((move) => ({ ...move, figure: { ...move.figure, type: EFigures.rock } }));
      this.possibleMoves = possibleRockMoves;
      return possibleRockMoves;
   }

   findAllActions(): TMoveInfoWithoutTransformation[] {
      const allActions: ICommonMoveInfoTemplate[] = this.findAllLinearActions();
      const allRockActions: IRockMoveInfo[] = allActions.map((move) => ({ ...move, figure: { ...move.figure, type: EFigures.rock } }));
      this.allActions = allRockActions;
      return allRockActions;
   }
}
