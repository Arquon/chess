import { type IMoveInfo } from "@/types/IMove";
import Figure, { EFigures, type IFigure } from "../main/figure";
import { type ICellPosition } from "@/types/cell/TCellNumbers";
import { EColors } from "@/types/cell/ECellColors";
import { cellPositionToString } from "@/utils/functions";

interface IKing extends IFigure {
   figureName: EFigures.king;
}

export default class King extends Figure implements IKing {
   figureName: EFigures.king = EFigures.king;

   findPossibleMoves(): IMoveInfo[] {
      const isWhite = this.figureColor === EColors.white;
      const attackedFields = isWhite ? this.board.blackAttackedFields : this.board.whiteAttackedFields;

      const possibleMoves: IMoveInfo[] = [];

      for (const action of this.allActions) {
         const fieldAttacks = attackedFields.get(cellPositionToString(action.position));

         if (!fieldAttacks || fieldAttacks.length === 0) {
            possibleMoves.push(action);
            continue;
         }
      }

      this.possibleMoves = possibleMoves;
      return possibleMoves;
   }

   findAllActions(): IMoveInfo[] {
      const {
         position: { x: kingX, y: kingY },
      } = this;

      const allActions: IMoveInfo[] = [];

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

      this.allActions = allActions;

      return allActions;
   }

   private isUnderAttack(): boolean {
      return false;
   }
}
