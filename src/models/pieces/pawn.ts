import { EColors } from "@/types/cell/ECellColors";
import { type TPawnMoveInfo } from "@/types/moves/PawnMoveInfo";

import Figure, { EFigures, type IFigure } from "../main/figure";

export interface IPawn extends IFigure {
   figureName: EFigures.pawn;
}

export default class Pawn extends Figure implements IPawn {
   figureName: EFigures.pawn = EFigures.pawn;
   allActions: TPawnMoveInfo[] = [];

   findPossibleMoves(): TPawnMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         return shieldMoves;
      }

      const possibleMoves: TPawnMoveInfo[] = [];

      switch (protectionDirection) {
         case false:
            for (const action of this.allActions) {
               possibleMoves.push(action);
            }
            break;
         case "forward":
         case "backward":
            for (const action of this.allActions) {
               const {
                  info: { position: actionPosition },
               } = action;
               if (actionPosition.x === this.position.x) {
                  possibleMoves.push(action);
               }
            }
            break;
         case "forward-right":
            if (this.figureColor === EColors.white) {
               for (const action of this.allActions) {
                  const {
                     info: { position: actionPosition },
                  } = action;
                  if (actionPosition.x > this.position.x && actionPosition.y > this.position.y) {
                     possibleMoves.push(action);
                  }
               }
            }
            break;
         case "forward-left":
            if (this.figureColor === EColors.white) {
               for (const action of this.allActions) {
                  const {
                     info: { position: actionPosition },
                  } = action;
                  if (actionPosition.x < this.position.x && actionPosition.y > this.position.y) {
                     possibleMoves.push(action);
                  }
               }
            }
            break;
         case "backward-right":
            if (this.figureColor === EColors.black) {
               for (const action of this.allActions) {
                  const {
                     info: { position: actionPosition },
                  } = action;
                  if (actionPosition.x > this.position.x && actionPosition.y < this.position.y) {
                     possibleMoves.push(action);
                  }
               }
            }
            break;
         case "backward-left":
            if (this.figureColor === EColors.black) {
               for (const action of this.allActions) {
                  const {
                     info: { position: actionPosition },
                  } = action;
                  if (actionPosition.x < this.position.x && actionPosition.y < this.position.y) {
                     possibleMoves.push(action);
                  }
               }
            }
            break;
      }

      this.possibleMoves = possibleMoves;

      return possibleMoves;
   }

   findAllActions(): TPawnMoveInfo[] {
      const allActions: TPawnMoveInfo[] = [];

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

   private checkForNextMove(): TPawnMoveInfo | false {
      const isWhite = this.figureColor === EColors.white;
      const delY = isWhite ? 1 : -1;
      const edgeY = isWhite ? 7 : 0;
      const cell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });

      if (!(cell instanceof Figure)) {
         const move: TPawnMoveInfo = {
            figure: {
               type: EFigures.pawn,
               position: this.position,
            },
            info: {
               position: cell.position,
            },
         };

         if (this.position.y + delY === edgeY) {
            move.info.description = "transformation";
            return move;
         }

         move.info.description = "moveWithoutAttack";
         return move;
      }

      return false;
   }

   private checkForLongMove(): TPawnMoveInfo | false {
      const startPosition = this.figureColor === EColors.white ? 1 : 6;
      const delY = this.figureColor === EColors.white ? 1 : -1;

      if (this.position.y === startPosition) {
         const firstCell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });
         if (!(firstCell instanceof Figure)) {
            const secondCell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + 2 * delY });
            if (!(secondCell instanceof Figure)) {
               const move: TPawnMoveInfo = {
                  figure: {
                     type: EFigures.pawn,
                     position: this.position,
                  },
                  info: {
                     description: "moveWithoutAttack",
                     position: secondCell.position,
                  },
               };

               return move;
            }
         }
      }

      return false;
   }

   private checkForAttack(side: "left" | "right"): TPawnMoveInfo | false {
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

         const isFigureEnemyExpression = cell instanceof Figure && cell.figureColor !== this.figureColor;

         const move: TPawnMoveInfo = {
            figure: {
               type: EFigures.pawn,
               position: this.position,
            },
            info: {
               position: cell.position,
            },
         };

         if (isFigureEnemyExpression) {
            if (this.position.y + delY === edgeY) move.info.description = "transformation-capture";
            else move.info.description = "capture";
         } else move.info.description = "attackWithoutMove";

         return move;
      }

      return false;
   }

   private checkForEnPassant(): TPawnMoveInfo | false {
      const lastMove = this.board.moves.at(-1);
      if (!lastMove) return false;
      if (!(lastMove.figure instanceof Pawn)) return false;

      const {
         figure: { position: previousPosition },
         info: { position: nextPosition },
      } = lastMove;

      if (this.position.y !== nextPosition.y) return false;
      if (Math.abs(nextPosition.y - previousPosition.y) !== 2) return false;
      if (Math.abs(this.position.x - nextPosition.x) !== 1) return false;

      const move: TPawnMoveInfo = {
         figure: {
            type: EFigures.pawn,
            position: this.position,
         },
         info: {
            description: "enPassant",
            position: {
               x: nextPosition.x,
               y: (nextPosition.y + previousPosition.y) / 2,
            },
         },
      };

      return move;
   }
}
