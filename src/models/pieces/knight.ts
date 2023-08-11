import { type IKnightMoveInfo } from "@/types/moves/CommonMoveInfo";
import Figure, { EFigures, type IFigure } from "../main/figure";

interface IKnight extends IFigure {
   figureName: EFigures.knight;
}

export default class Knight extends Figure implements IKnight {
   figureName: EFigures.knight = EFigures.knight;
   allActions: IKnightMoveInfo[] = [];

   findPossibleMoves(): IKnightMoveInfo[] {
      const { shieldMoves, protectionDirection } = this.getProtectionDirectionAndShieldMoves();

      if (shieldMoves) {
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

      for (let delX = -2; delX <= 2; delX += 4) {
         for (let delY = -1; delY <= 1; delY += 2) {
            if (x + delX > 7 || x + delX < 0 || y + delY > 7 || y + delY < 0) continue;

            const possibleMove = this.board.getCellByPosition({ x: x + delX, y: y + delY });
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
               allMoves.push(move);
               continue;
            }

            if (Figure.checkIsEnemy(this, possibleMove)) {
               move.info.description = "capture";
               allMoves.push(move);
               continue;
            }

            move.info.description = "capture";
            allMoves.push(move);
         }
      }

      for (let delY = -2; delY <= 2; delY += 4) {
         for (let delX = -1; delX <= 1; delX += 2) {
            if (x + delX > 7 || x + delX < 0 || y + delY > 7 || y + delY < 0) continue;

            const possibleMove = this.board.getCellByPosition({ x: x + delX, y: y + delY });
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
               allMoves.push(move);
               continue;
            }

            if (Figure.checkIsEnemy(this, possibleMove)) {
               move.info.description = "capture";
               allMoves.push(move);
               continue;
            }

            move.info.description = "capture";
            allMoves.push(move);
         }
      }

      this.allActions = allMoves;

      return allMoves;
   }
}
