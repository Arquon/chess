import { DiagonalFigure } from "./utils/diagonalFigure";
import { type IMoveInfo } from "@/types/IMove";
import { EFigures, type IFigure } from "../main/figure";

interface IBishop extends IFigure {
   figureName: EFigures.bishop;
}

export default class Bishop extends DiagonalFigure implements IBishop {
   figureName: EFigures.bishop = EFigures.bishop;

   findAllActions(): IMoveInfo[] {
      const allActions = this.findAllDiagonalActions();
      this.allActions = allActions;
      return allActions;
   }
}
