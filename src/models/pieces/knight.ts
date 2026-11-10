import { type IKnightMoveInfo } from "@/types/moves/CommonMoveInfo";
import Figure, { EFigures, type IFigure } from "../main/figure";
import { type ICellPosition } from "@/types/cell/TCellNumbers";

interface IKnight extends IFigure {
   figureName: EFigures.knight;
}

export default class Knight extends Figure implements IKnight {
   figureName: EFigures.knight = EFigures.knight;
   allActions: IKnightMoveInfo[] = [];

   findPossibleMoves(): IKnightMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
         this.possibleMoves = shieldMoves;
         return shieldMoves;
      }

      const possibleKnightMoves: IKnightMoveInfo[] = [];

      if (!protectionDirection) {
         for (const action of this.allActions) {
            possibleKnightMoves.push(action);
         }
      }

      this.possibleMoves = possibleKnightMoves;
      return possibleKnightMoves;
   }

   findAllActions(): IKnightMoveInfo[] {
      const {
         position: { x, y },
      } = this;
      const allMoves: IKnightMoveInfo[] = [];

      const knightMoves = [
         { delX: -2, delY: -1 },
         { delX: -2, delY: 1 },
         { delX: 2, delY: -1 },
         { delX: 2, delY: 1 },
         { delX: -1, delY: -2 },
         { delX: -1, delY: 2 },
         { delX: 1, delY: -2 },
         { delX: 1, delY: 2 },
      ];

      for (const { delX, delY } of knightMoves) {
         if (x + delX > 7 || x + delX < 0 || y + delY > 7 || y + delY < 0) continue;

         const move = this.getMoveInfo({ x: x + delX, y: y + delY });
         allMoves.push(move);
      }

      this.allActions = allMoves;

      return allMoves;
   }

   private getMoveInfo({ x, y }: ICellPosition): IKnightMoveInfo {
      const possibleMove = this.board.getCellByPosition({ x, y });
      const move: IKnightMoveInfo = {
         figure: {
            type: EFigures.knight,
            position: this.position,
         },
         info: {
            position: possibleMove.position,
         },
      };

      if (!(possibleMove instanceof Figure)) {
         return move;
      }

      if (Figure.checkIsEnemy(this, possibleMove)) {
         move.info.description = "capture";
         return move;
      }

      move.info.description = "attackWithoutMove";
      return move;
   }
}
