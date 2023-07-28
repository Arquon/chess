import { type IPossibleAction } from "@/types/IMove";
import Figure, { EFigures, type IFigure } from "../main/figure";
import { EColors } from "@/types/cell/ECellColors";
import { type ICellPosition } from "@/types/cell/TCellNumbers";
import { cellPositionToString } from "@/utils/functions";
import type Board from "../main/board";

interface IKing extends IFigure {
   figureName: EFigures.king;
}

export default class King extends Figure implements IKing {
   figureName: EFigures.king = EFigures.king;

   findAllActions(board?: Board): IPossibleAction[] {
      const isWhite = this.figureColor === EColors.white;
      const attackedFields = isWhite ? this.board.blackAttackedFields : this.board.whiteAttackedFields;
      const {
         position: { x: kingX, y: kingY },
      } = this;

      console.log("board check", board === this.board);

      const allActions: IPossibleAction[] = [];

      for (let divX = -1; divX <= 1; divX++) {
         for (let divY = -1; divY <= 1; divY++) {
            if (divX === 0 && divY === 0) continue;
            if (kingX + divX < 0 || kingX + divX > 7 || kingY + divY < 0 || kingY + divY > 7) continue;
            const cellPosition: ICellPosition = { x: kingX + divX, y: kingY + divY };
            const move = this.board.getCellByPosition(cellPosition);

            if (move instanceof Figure) {
               if (!Figure.checkIsEnemy(this, move)) {
                  allActions.push({ figure: this, position: move.position, possible: false, info: "attackWithoutMove" });
                  continue;
               }
            }

            const fieldAttacks = attackedFields.get(cellPositionToString(cellPosition));

            if (cellPositionToString(cellPosition) === "4-6")
               console.log({ attackedFields, board: this.board, queen: this.board.whiteFigures.queens[0], king: this });

            if (fieldAttacks && fieldAttacks.length > 0) {
               allActions.push({ figure: this, position: move.position, possible: false, info: "attackWithoutMove" });
               continue;
            }

            allActions.push({ figure: this, position: move.position, possible: true, info: move instanceof Figure ? "capture" : undefined });
         }
      }

      this.allActions = allActions;

      return allActions;
   }

   private isUnderAttack(): boolean {
      return false;
   }
}
