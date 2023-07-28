import { type IPossibleAction, type IMoveInfo } from "@/types/IMove";
import Figure, { EFigures, type IFigure } from "../main/figure";

interface IKnight extends IFigure {
   figureName: EFigures.knight;
}

export default class Knight extends Figure implements IKnight {
   figureName: EFigures.knight = EFigures.knight;

   findAllActions(): IPossibleAction[] {
      const protectionDirection = this.isShieldForKing();

      const {
         position: { x, y },
      } = this;
      const allMoves: IMoveInfo[] = [];

      for (let delX = -2; delX <= 2; delX += 4) {
         for (let delY = -1; delY <= 1; delY += 2) {
            if (x + delX > 7 || x + delX < 0 || y + delY > 7 || y + delY < 0) continue;

            const move = this.board.getCellByPosition({ x: x + delX, y: y + delY });
            if (!(move instanceof Figure)) {
               allMoves.push({ position: move.position, figure: this });
               continue;
            }

            if (Figure.checkIsEnemy(this, move)) {
               allMoves.push({ position: move.position, info: "capture", figure: this });
               continue;
            }

            allMoves.push({ position: move.position, info: "attackWithoutMove", figure: this });
         }
      }

      for (let delY = -2; delY <= 2; delY += 4) {
         for (let delX = -1; delX <= 1; delX += 2) {
            if (x + delX > 7 || x + delX < 0 || y + delY > 7 || y + delY < 0) continue;

            const move = this.board.getCellByPosition({ x: x + delX, y: y + delY });
            if (!(move instanceof Figure)) {
               allMoves.push({ position: move.position, figure: this });
               continue;
            }

            if (Figure.checkIsEnemy(this, move)) {
               allMoves.push({ position: move.position, info: "capture", figure: this });
               continue;
            }

            allMoves.push({ position: move.position, info: "attackWithoutMove", figure: this });
         }
      }

      const allActions: IPossibleAction[] = allMoves.map((move) => ({
         ...move,
         possible: !protectionDirection,
      }));

      this.allActions = allActions;

      return allActions;
   }
}
