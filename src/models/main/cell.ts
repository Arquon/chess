import { type ICellPosition } from "@/types/cell/TCellNumbers";

interface ICell {
   position: ICellPosition;
}

export default class Cell implements ICell {
   position: ICellPosition;

   constructor(position: ICellPosition) {
      this.position = position;
   }

   static checkCellsHasSamePosition(firstCell: Cell, secondCell: Cell): boolean {
      return firstCell.position.x === secondCell.position.x && firstCell.position.y === secondCell.position.y;
   }

   static checkCellsAreTheSame(firstCell: Cell, secondCell: Cell): boolean {
      return this.checkCellsHasSamePosition(firstCell, secondCell) && firstCell.constructor === secondCell.constructor;
   }

   static checkIfCellOnDiagonalBetweenTwoPoints(firstPoint: ICellPosition, secondPoint: ICellPosition, cell: ICellPosition): boolean {
      const maxX = Math.max(firstPoint.x, secondPoint.x);
      const minX = Math.min(firstPoint.x, secondPoint.x);
      const maxY = Math.max(firstPoint.y, secondPoint.y);
      const minY = Math.min(firstPoint.y, secondPoint.y);

      const isCellInRectangle = minX <= cell.x && cell.x <= maxX && minY <= cell.y && cell.y <= maxY;

      return (
         isCellInRectangle && (cell.x - firstPoint.x) * (secondPoint.y - firstPoint.y) === (cell.y - firstPoint.y) * (secondPoint.x - firstPoint.x)
      );
   }

   static checkIfCellOnLineBetweenTwoPoints(firstPoint: ICellPosition, secondPoint: ICellPosition, cell: ICellPosition): boolean {
      if (firstPoint.x === secondPoint.x) return Cell.checkIfCellOnVerticalBetweenPoints(firstPoint, secondPoint, cell);
      if (firstPoint.y === secondPoint.y) return Cell.checkIfCellOnHorizontalBetweenPoints(firstPoint, secondPoint, cell);
      throw "points are not on one line";
   }

   static checkIfCellOnVerticalBetweenPoints(firstPoint: ICellPosition, secondPoint: ICellPosition, cell: ICellPosition): boolean {
      const maxY = Math.max(firstPoint.y, secondPoint.y);
      const minY = Math.min(firstPoint.y, secondPoint.y);

      return cell.x === firstPoint.x && cell.y <= maxY && cell.y >= minY;
   }

   static checkIfCellOnHorizontalBetweenPoints(firstPoint: ICellPosition, secondPoint: ICellPosition, cell: ICellPosition): boolean {
      const maxX = Math.max(firstPoint.x, secondPoint.x);
      const minX = Math.min(firstPoint.x, secondPoint.x);

      return cell.y === firstPoint.y && cell.x <= maxX && cell.x >= minX;
   }
}
