import { EColors } from "@/types/cell/ECellColors";
import { type TMoveInfo, type IMoveInfo } from "@/types/IMove";

import Figure, { EFigures, type IFigure } from "../main/figure";

interface IPawn extends IFigure {
   figureName: EFigures.pawn;
}

interface IEnPassantResult extends IMoveInfo {
   side: "right" | "left";
}

export default class Pawn extends Figure implements IPawn {
   figureName: EFigures.pawn = EFigures.pawn;

   findPossibleMoves(): IMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const possibleMoves: IMoveInfo[] = [];

      switch (protectionDirection) {
         case false:
            for (const action of this.allActions) {
               possibleMoves.push(action);
            }
            break;
         case "forward":
         case "backward":
            for (const action of this.allActions) {
               if (action.position.x === this.position.x) {
                  possibleMoves.push(action);
               }
            }
            break;
         case "forward-right":
            if (this.figureColor === EColors.white) {
               for (const action of this.allActions) {
                  if (action.position.x > this.position.x && action.position.y > this.position.y) {
                     possibleMoves.push(action);
                  }
               }
            }
            break;
         case "forward-left":
            if (this.figureColor === EColors.white) {
               for (const action of this.allActions) {
                  if (action.position.x < this.position.x && action.position.y > this.position.y) {
                     possibleMoves.push(action);
                  }
               }
            }
            break;
         case "backward-right":
            if (this.figureColor === EColors.black) {
               for (const action of this.allActions) {
                  if (action.position.x > this.position.x && action.position.y < this.position.y) {
                     possibleMoves.push(action);
                  }
               }
            }
            break;
         case "backward-left":
            if (this.figureColor === EColors.black) {
               for (const action of this.allActions) {
                  if (action.position.x < this.position.x && action.position.y < this.position.y) {
                     possibleMoves.push(action);
                  }
               }
            }
            break;
      }

      this.possibleMoves = possibleMoves;

      return possibleMoves;
   }

   findAllActions(): IMoveInfo[] {
      const allActions: IMoveInfo[] = [];

      const isCaptureLeftCell = this.checkForAttack("left");

      if (isCaptureLeftCell) {
         allActions.push(isCaptureLeftCell);
      }

      const isCaptureRightCell = this.checkForAttack("right");
      if (isCaptureRightCell) {
         allActions.push(isCaptureRightCell);
      }

      const isNextMoveCell = this.checkForNextMove();
      if (isNextMoveCell) {
         allActions.push(isNextMoveCell);
      }

      const isLongMoveCell = this.checkForLongMove();
      if (isLongMoveCell) {
         allActions.push(isLongMoveCell);
      }

      const isEnPassant = this.checkForEnPassant();
      if (isEnPassant) {
         allActions.push({ position: isEnPassant.position, info: isEnPassant.info, figure: this });
      }

      this.allActions = allActions.map((action) => ({ ...action, possible: false }));

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
