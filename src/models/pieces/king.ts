import Figure, { EFigures, type IFigure } from "../main/figure";
import { type ICellPosition } from "@/types/cell/TCellNumbers";
import { EColors } from "@/types/cell/ECellColors";
import { cellPositionToString } from "@/utils/functions";
import Cell from "../main/cell";
import type Rock from "./rock";
import { type TMoveInfoWithoutTransformation } from "@/types/MoveInfo";
import { type TKingMoveInfo } from "@/types/moves/KingMoveInfo";

interface IKing extends IFigure {
   figureName: EFigures.king;
   wereMoved: boolean;
}

export default class King extends Figure implements IKing {
   figureName: EFigures.king = EFigures.king;
   wereMoved: boolean = false;
   allActions: TKingMoveInfo[] = [];

   findPossibleMoves(): TKingMoveInfo[] {
      const isWhite = this.figureColor === EColors.white;
      const attackedFields = isWhite ? this.board.blackAttackedFields : this.board.whiteAttackedFields;

      const possibleMoves: TKingMoveInfo[] = [];

      const attacksOnKing = this.board.getAttacksOnKing(this.figureColor);

      for (const action of this.allActions) {
         const {
            info: { position: movePosition },
         } = action;
         let skipAction = false;
         for (const attack of attacksOnKing) {
            const {
               figure: { position: figurePosition },
            } = attack;
            const attackFigure = this.board.getFigureByPosition(figurePosition);

            if (attackFigure.isDiagonalFigure() && Cell.checkIfCellsOnTheSameDiagonal(attackFigure.position, movePosition, this.position)) {
               skipAction = true;
               break;
            }
            if (attackFigure.isLinearFigure()) {
               if (Cell.checkIfCellsOnTheSameHorizontal(attackFigure.position, movePosition, this.position)) {
                  skipAction = true;
                  break;
               }
               if (Cell.checkIfCellsOnTheSameVertical(attackFigure.position, movePosition, this.position)) {
                  skipAction = true;
                  break;
               }
            }
         }

         if (skipAction) continue;

         const fieldAttacks = attackedFields.get(cellPositionToString(movePosition));

         if (!fieldAttacks || fieldAttacks.length === 0) {
            possibleMoves.push(action);
            continue;
         }
      }

      this.possibleMoves = possibleMoves;
      return possibleMoves;
   }

   findAllActions(): TKingMoveInfo[] {
      const {
         position: { x: kingX, y: kingY },
      } = this;

      const allActions: TKingMoveInfo[] = [];

      for (let divX = -1; divX <= 1; divX++) {
         for (let divY = -1; divY <= 1; divY++) {
            if (divX === 0 && divY === 0) continue;
            if (kingX + divX < 0 || kingX + divX > 7 || kingY + divY < 0 || kingY + divY > 7) continue;
            const cellPosition: ICellPosition = { x: kingX + divX, y: kingY + divY };
            const possibleMove = this.board.getCellByPosition(cellPosition);

            const move: TKingMoveInfo = {
               figure: {
                  type: EFigures.king,
                  position: this.position,
               },
               info: {
                  position: possibleMove.position,
               },
            };

            if (!(possibleMove instanceof Figure)) {
               allActions.push(move);
               continue;
            }

            if (Figure.checkIsEnemy(this, possibleMove)) {
               move.info.description = "capture";
               allActions.push(move);
               continue;
            }

            move.info.description = "attackWithoutMove";
            allActions.push(move);
         }
      }

      const castleMoves = this.checkForCastle();
      allActions.push(...castleMoves);

      this.allActions = allActions;

      return allActions;
   }

   checkForCastle(): TKingMoveInfo[] {
      const figures = this.isWhite() ? this.board.whiteFigures : this.board.blackFigures;
      const attackedFields = this.isWhite() ? this.board.blackAttackedFields : this.board.whiteAttackedFields;

      const king = figures.king;
      if (king.wereMoved) return [];
      if (this.board.getAttacksOnKing(this.figureColor).length !== 0) return [];

      const rocks = figures.rocks.filter((rock) => rock.isAlive && !rock.wereMoved);

      const castleMoves: TKingMoveInfo[] = [];

      const isLongCastle = this.checkForLongCastle(rocks, attackedFields);
      if (isLongCastle) {
         castleMoves.push(isLongCastle);
      }

      const isShortCastle = this.checkForShortCastle(rocks, attackedFields);
      if (isShortCastle) {
         castleMoves.push(isShortCastle);
      }

      return castleMoves;
   }

   private checkForLongCastle(rocks: Rock[], attackedFields: Map<string, TMoveInfoWithoutTransformation[]>): TKingMoveInfo | false {
      for (const rock of rocks) {
         const { position: rockPosition } = rock;
         if (rockPosition.x === 0) {
            for (let i = 2; i <= 3; i++) {
               const possibleFigure = this.board.getCellByPosition({ x: i, y: rockPosition.y });
               if (possibleFigure instanceof Figure) return false;

               const attacks = attackedFields.get(cellPositionToString({ x: i, y: rockPosition.y })) ?? [];
               if (attacks.length !== 0) return false;
            }

            const move: TKingMoveInfo = {
               figure: {
                  type: EFigures.king,
                  position: this.position,
               },
               info: {
                  position: {
                     x: 2,
                     y: rockPosition.y,
                  },
                  rockPosition: rock.position,
                  description: "long-castle",
               },
            };

            return move;
         }
      }

      return false;
   }

   private checkForShortCastle(rocks: Rock[], attackedFields: Map<string, TMoveInfoWithoutTransformation[]>): TKingMoveInfo | false {
      for (const rock of rocks) {
         const { position: rockPosition } = rock;
         if (rockPosition.x === 7) {
            for (let i = 5; i <= 6; i++) {
               const possibleFigure = this.board.getCellByPosition({ x: i, y: rockPosition.y });
               if (possibleFigure instanceof Figure) return false;

               const attacks = attackedFields.get(cellPositionToString({ x: i, y: rockPosition.y })) ?? [];
               if (attacks.length !== 0) return false;
            }

            const move: TKingMoveInfo = {
               figure: {
                  type: EFigures.king,
                  position: this.position,
               },
               info: {
                  position: {
                     x: 6,
                     y: rockPosition.y,
                  },
                  description: "short-castle",
                  rockPosition: rock.position,
               },
            };

            return move;
         }
      }

      return false;
   }
}
