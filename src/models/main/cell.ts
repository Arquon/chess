import { type ICellPosition } from "@/types/cell/TCellNumbers";

interface ICell {
   position: ICellPosition;
}

export default class Cell implements ICell {
   position: ICellPosition;

   constructor(position: ICellPosition) {
      this.position = position;
   }

   static CheckCellsHasSamePosition(firstCell: Cell, secondCell: Cell): boolean {
      return firstCell.position.x === secondCell.position.x && firstCell.position.y === secondCell.position.y;
   }

   static CheckCellsAreTheSame(firstCell: Cell, secondCell: Cell): boolean {
      return this.CheckCellsHasSamePosition(firstCell, secondCell) && firstCell.constructor === secondCell.constructor;
   }
}
