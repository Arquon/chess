import { EColors } from "@/types/cell/ECellColors";
import { type TMoveInfo, type IMoveInfo, type IPossibleAction } from "@/types/IMove";

import Figure, { EFigures, type IFigure } from "../main/figure";

interface IPawn extends IFigure {
   figureName: EFigures.pawn;
}

interface IEnPassantResult extends IMoveInfo {
   side: "right" | "left";
}

export default class Pawn extends Figure implements IPawn {
   figureName: EFigures.pawn = EFigures.pawn;

   findAllActions(): IPossibleAction[] {
      const protectionDirection = this.isShieldForKing();

      const allActions: IPossibleAction[] = [];

      const isCaptureLeftCell = this.checkForAttack("left");

      if (isCaptureLeftCell) {
         if (isCaptureLeftCell.info === "attackWithoutMove") {
            allActions.push({ ...isCaptureLeftCell, possible: false });
         } else if (!protectionDirection) {
            allActions.push({ ...isCaptureLeftCell, possible: true });
         } else if (protectionDirection === "forward-left" && this.figureColor === EColors.white) {
            allActions.push({ ...isCaptureLeftCell, possible: true });
         } else if (protectionDirection === "backward-left" && this.figureColor === EColors.black) {
            allActions.push({ ...isCaptureLeftCell, possible: true });
         } else {
            allActions.push({ ...isCaptureLeftCell, possible: false });
         }
      }

      const isCaptureRightCell = this.checkForAttack("right");
      if (isCaptureRightCell) {
         if (isCaptureRightCell.info === "attackWithoutMove") {
            allActions.push({ ...isCaptureRightCell, possible: false });
         } else if (!protectionDirection) {
            allActions.push({ ...isCaptureRightCell, possible: true });
         } else if (protectionDirection === "forward-right" && this.figureColor === EColors.white) {
            allActions.push({ ...isCaptureRightCell, possible: true });
         } else if (protectionDirection === "backward-right" && this.figureColor === EColors.black) {
            allActions.push({ ...isCaptureRightCell, possible: true });
         } else {
            allActions.push({ ...isCaptureRightCell, possible: false });
         }
      }

      const isNextMoveCell = this.checkForNextMove();
      if (isNextMoveCell) {
         if (!protectionDirection || protectionDirection === "forward" || protectionDirection === "backward") {
            allActions.push({ ...isNextMoveCell, possible: true });
         } else {
            allActions.push({ ...isNextMoveCell, possible: false });
         }
      }

      const isLongMoveCell = this.checkForLongMove();
      if (isLongMoveCell) {
         if (!protectionDirection || protectionDirection === "forward" || protectionDirection === "backward") {
            allActions.push({ ...isLongMoveCell, possible: true });
         } else {
            allActions.push({ ...isLongMoveCell, possible: false });
         }
      }

      const isEnPassant = this.checkForEnPassant();
      if (isEnPassant) {
         if (!protectionDirection) {
            allActions.push({ position: isEnPassant.position, info: isEnPassant.info, possible: true, figure: this });
         } else if (protectionDirection === "forward-left" && isEnPassant.side === "left" && this.figureColor === EColors.white) {
            allActions.push({ position: isEnPassant.position, info: isEnPassant.info, possible: true, figure: this });
         } else if (protectionDirection === "backward-left" && isEnPassant.side === "left" && this.figureColor === EColors.black) {
            allActions.push({ position: isEnPassant.position, info: isEnPassant.info, possible: true, figure: this });
         } else if (protectionDirection === "forward-right" && isEnPassant.side === "right" && this.figureColor === EColors.white) {
            allActions.push({ position: isEnPassant.position, info: isEnPassant.info, possible: true, figure: this });
         } else if (protectionDirection === "backward-right" && isEnPassant.side === "right" && this.figureColor === EColors.black) {
            allActions.push({ position: isEnPassant.position, info: isEnPassant.info, possible: true, figure: this });
         } else {
            allActions.push({ position: isEnPassant.position, info: isEnPassant.info, possible: false, figure: this });
         }
      }

      this.allActions = allActions;

      return allActions;
   }

   private checkForNextMove(): IMoveInfo | false {
      const delY = this.figureColor === EColors.white ? 1 : -1;
      const cell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });

      if (!(cell instanceof Figure)) {
         return { position: cell.position, info: "moveWithoutAttack", figure: this };
      }

      return false;
   }

   private checkForLongMove(): IMoveInfo | false {
      const startPosition = this.figureColor === EColors.white ? 1 : 6;
      const delY = this.figureColor === EColors.white ? 1 : -1;

      if (this.position.y === startPosition) {
         const firstCell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });
         if (!(firstCell instanceof Figure)) {
            const secondCell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + 2 * delY });
            if (!(secondCell instanceof Figure)) return { position: secondCell.position, info: "moveWithoutAttack", figure: this };
         }
      }

      return false;
   }

   private checkForAttack(side: "left" | "right"): IMoveInfo | false {
      const delY = this.figureColor === EColors.white ? 1 : -1;
      const delX = side === "left" ? -1 : 1;
      const edge = side === "left" ? 0 : 7;

      // const whiteLeftExpression = protectionDirection === "forward-left" && this.figureColor === EColors.white && side === "left";
      // const whiteRightExpression = protectionDirection === "forward-right" && this.figureColor === EColors.white && side === "right";
      // const blackLeftExpression = protectionDirection === "backward-left" && this.figureColor === EColors.black && side === "left";
      // const blackRightExpression = protectionDirection === "backward-right" && this.figureColor === EColors.white && side === "right";

      if (this.position.x !== edge) {
         const cell = this.board.getCellByPosition({ x: this.position.x + delX, y: this.position.y + delY });

         let moveInfo: TMoveInfo;

         const isFigureEnemyExpression = cell instanceof Figure && cell.figureColor !== this.figureColor;

         if (isFigureEnemyExpression) moveInfo = "capture";
         else moveInfo = "attackWithoutMove";

         return {
            position: cell.position,
            info: moveInfo,
            figure: this,
         };
      }

      return false;
   }

   private checkForEnPassant(): IEnPassantResult | false {
      const lastMove = this.board.moves.at(-1);
      if (!lastMove) return false;
      if (!(lastMove.figure instanceof Pawn)) return false;

      const { nextPosition, previousPosition } = lastMove;

      if (this.position.y !== nextPosition.y) return false;
      if (Math.abs(nextPosition.y - previousPosition.y) !== 2) return false;
      if (Math.abs(this.position.x - nextPosition.x) !== 1) return false;

      return {
         position: {
            x: nextPosition.x,
            y: (nextPosition.y + previousPosition.y) / 2,
         },
         info: "enPassant",
         side: this.position.x > nextPosition.x ? "left" : "right",
         figure: this,
      };
   }
}
