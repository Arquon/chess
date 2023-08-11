import Figure, { EFigures, type IFigure } from "../main/figure";
import { type ICellPosition } from "@/types/cell/TCellNumbers";
import { EColors } from "@/types/cell/ECellColors";
import { cellPositionToString } from "@/utils/functions";
import Cell from "../main/cell";
import type Rock from "./rock";
import { type TMoveInfo } from "@/types/MoveInfo";

interface IKing extends IFigure {
   figureName: EFigures.king;
   wereMoved: boolean;
}

export default class King extends Figure implements IKing {
   figureName: EFigures.king = EFigures.king;
   wereMoved: boolean = false;

   findPossibleMoves(): TMoveInfo[] {
      const isWhite = this.figureColor === EColors.white;
      const attackedFields = isWhite ? this.board.blackAttackedFields : this.board.whiteAttackedFields;

      const possibleMoves: TMoveInfo[] = [];

      const attacksOnKing = this.board.getAttacksOnKing(this.figureColor);

      for (const action of this.allActions) {
         let skipAction = false;
         for (const attack of attacksOnKing) {
            if (attack.figure.isDiagonalFigure() && Cell.checkIfCellsOnTheSameDiagonal(attack.figure.position, action.position, this.position)) {
               skipAction = true;
               break;
            }
            if (attack.figure.isLinearFigure()) {
               if (Cell.checkIfCellsOnTheSameHorizontal(attack.figure.position, action.position, this.position)) {
                  skipAction = true;
                  break;
               }
               if (Cell.checkIfCellsOnTheSameVertical(attack.figure.position, action.position, this.position)) {
                  skipAction = true;
                  break;
               }
            }
         }

         if (skipAction) continue;

         const fieldAttacks = attackedFields.get(cellPositionToString(action.position));

         if (!fieldAttacks || fieldAttacks.length === 0) {
            possibleMoves.push(action);
            continue;
         }
      }

      this.possibleMoves = possibleMoves;
      return possibleMoves;
   }

   findAllActions(): TMoveInfo[] {
      const {
         position: { x: kingX, y: kingY },
      } = this;

      const allActions: TMoveInfo[] = [];

      for (let divX = -1; divX <= 1; divX++) {
         for (let divY = -1; divY <= 1; divY++) {
            if (divX === 0 && divY === 0) continue;
            if (kingX + divX < 0 || kingX + divX > 7 || kingY + divY < 0 || kingY + divY > 7) continue;
            const cellPosition: ICellPosition = { x: kingX + divX, y: kingY + divY };
            const move = this.board.getCellByPosition(cellPosition);

            if (move instanceof Figure) {
               if (!Figure.checkIsEnemy(this, move)) {
                  allActions.push({ figure: this, position: move.position, info: "attackWithoutMove" });
                  continue;
               }
            }

            allActions.push({ figure: this, position: move.position, info: move instanceof Figure ? "capture" : undefined });
         }
      }

      const castleMoves = this.checkForCastle();
      allActions.push(...castleMoves);

      this.allActions = allActions;

      return allActions;
   }

   checkForCastle(): TMoveInfo[] {
      const figures = this.isWhite() ? this.board.whiteFigures : this.board.blackFigures;
      const attackedFields = this.isWhite() ? this.board.blackAttackedFields : this.board.whiteAttackedFields;

      const king = figures.king;
      if (king.wereMoved) return [];
      if (this.board.getAttacksOnKing(this.figureColor).length !== 0) return [];

      const rocks = figures.rocks.filter((rock) => rock.isAlive && !rock.wereMoved);

      const castleMoves: TMoveInfo[] = [];

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

   private checkForLongCastle(rocks: Rock[], attackedFields: Map<string, TMoveInfo[]>): TMoveInfo | false {
      for (const rock of rocks) {
         const { position: rockPosition } = rock;
         if (rockPosition.x === 0) {
            for (let i = 2; i <= 3; i++) {
               const possibleFigure = this.board.getCellByPosition({ x: i, y: rockPosition.y });
               if (possibleFigure instanceof Figure) return false;

               const attacks = attackedFields.get(cellPositionToString({ x: i, y: rockPosition.y })) ?? [];
               if (attacks.length !== 0) return false;
            }
            return {
               figure: this,
               rock,
               position: {
                  x: 2,
                  y: rockPosition.y,
               },
               info: "long-castle",
            };
         }
      }

      return false;
   }

   private checkForShortCastle(rocks: Rock[], attackedFields: Map<string, TMoveInfo[]>): TMoveInfo | false {
      for (const rock of rocks) {
         const { position: rockPosition } = rock;
         if (rockPosition.x === 7) {
            for (let i = 5; i <= 6; i++) {
               const possibleFigure = this.board.getCellByPosition({ x: i, y: rockPosition.y });
               if (possibleFigure instanceof Figure) return false;

               const attacks = attackedFields.get(cellPositionToString({ x: i, y: rockPosition.y })) ?? [];
               if (attacks.length !== 0) return false;
            }

            return {
               figure: this,
               rock,
               position: {
                  x: 6,
                  y: rockPosition.y,
               },
               info: "short-castle",
            };
         }
      }

      return false;
   }
}
