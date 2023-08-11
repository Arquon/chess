import { EColors } from "@/types/cell/ECellColors";
import { type TMoveDescription } from "@/types/MoveDescription";
import { type TMoveInfo } from "@/types/MoveInfo";

import Figure, { EFigures, type IFigure } from "../main/figure";

export interface IPawn extends IFigure {
   figureName: EFigures.pawn;
}

export default class Pawn extends Figure implements IPawn {
   figureName: EFigures.pawn = EFigures.pawn;

   findPossibleMoves(): TMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const possibleMoves: TMoveInfo[] = [];

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

   findAllActions(): TMoveInfo[] {
      const allActions: TMoveInfo[] = [];

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
         allActions.push(isEnPassant);
      }

      this.allActions = allActions.map((action) => ({ ...action, possible: false }));

      return allActions;
   }

   private checkForNextMove(): TMoveInfo | false {
      const isWhite = this.figureColor === EColors.white;
      const delY = isWhite ? 1 : -1;
      const edgeY = isWhite ? 7 : 0;
      const cell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });

      if (!(cell instanceof Figure)) {
         return { position: cell.position, info: this.position.y + delY === edgeY ? "transformation" : "moveWithoutAttack", figure: this };
      }

      return false;
   }

   private checkForLongMove(): TMoveInfo | false {
      const startPosition = this.figureColor === EColors.white ? 1 : 6;
      const delY = this.figureColor === EColors.white ? 1 : -1;

      if (this.position.y === startPosition) {
         const firstCell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });
         if (!(firstCell instanceof Figure)) {
            const secondCell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + 2 * delY });
            if (!(secondCell instanceof Figure)) {
               return { position: secondCell.position, info: "moveWithoutAttack", figure: this };
            }
         }
      }

      return false;
   }

   private checkForAttack(side: "left" | "right"): TMoveInfo | false {
      const isWhite = this.figureColor === EColors.white;
      const delY = isWhite ? 1 : -1;
      const delX = side === "left" ? -1 : 1;
      const edgeX = side === "left" ? 0 : 7;
      const edgeY = isWhite ? 7 : 0;

      // const whiteLeftExpression = protectionDirection === "forward-left" && this.figureColor === EColors.white && side === "left";
      // const whiteRightExpression = protectionDirection === "forward-right" && this.figureColor === EColors.white && side === "right";
      // const blackLeftExpression = protectionDirection === "backward-left" && this.figureColor === EColors.black && side === "left";
      // const blackRightExpression = protectionDirection === "backward-right" && this.figureColor === EColors.white && side === "right";

      if (this.position.x !== edgeX) {
         const cell = this.board.getCellByPosition({ x: this.position.x + delX, y: this.position.y + delY });

         let moveInfo: TMoveDescription;

         const isFigureEnemyExpression = cell instanceof Figure && cell.figureColor !== this.figureColor;

         if (isFigureEnemyExpression) {
            moveInfo = this.position.y + delY === edgeY ? "transformation-capture" : "capture";
         } else moveInfo = "attackWithoutMove";

         return {
            position: cell.position,
            info: moveInfo,
            figure: this,
         };
      }

      return false;
   }

   private checkForEnPassant(): TMoveInfo | false {
      const lastMove = this.board.moves.at(-1);
      if (!lastMove) return false;
      if (!(lastMove.figure instanceof Pawn)) return false;

      const { position: nextPosition, previousPosition } = lastMove;

      if (this.position.y !== nextPosition.y) return false;
      if (Math.abs(nextPosition.y - previousPosition.y) !== 2) return false;
      if (Math.abs(this.position.x - nextPosition.x) !== 1) return false;

      return {
         position: {
            x: nextPosition.x,
            y: (nextPosition.y + previousPosition.y) / 2,
         },
         info: "enPassant",
         figure: this,
      };
   }
}
