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

   static checkIfCellsOnTheSameDiagonal(firstPoint: ICellPosition, secondPoint: ICellPosition, thirdPoint: ICellPosition): boolean {
      const k: number = (firstPoint.y - secondPoint.y) / (firstPoint.x - secondPoint.x);
      if (Math.abs(k) !== 1) return false;
      const b: number = firstPoint.y - k * firstPoint.x;
      const test: number = k * thirdPoint.x + b;
      return test === thirdPoint.y;
   }

   static checkIfCellsOnTheSameHorizontal(firstPoint: ICellPosition, secondPoint: ICellPosition, thirdPoint: ICellPosition): boolean {
      return firstPoint.y === secondPoint.y && secondPoint.y === thirdPoint.y;
   }

   static checkIfCellsOnTheSameVertical(firstPoint: ICellPosition, secondPoint: ICellPosition, thirdPoint: ICellPosition): boolean {
      return firstPoint.x === secondPoint.x && secondPoint.x === thirdPoint.x;
   }

   static checkIfCellsOnLine(firstPoint: ICellPosition, secondPoint: ICellPosition, thirdPoint: ICellPosition): boolean {
      if (firstPoint.x === secondPoint.x) return Cell.checkIfCellsOnTheSameHorizontal(firstPoint, secondPoint, thirdPoint);
      if (firstPoint.y === secondPoint.y) return Cell.checkIfCellsOnTheSameVertical(firstPoint, secondPoint, thirdPoint);
      return false;
   }

   static checkIfCellOnLineBetweenTwoPoints(firstPoint: ICellPosition, secondPoint: ICellPosition, cell: ICellPosition): boolean {
      if (firstPoint.x === secondPoint.x) return Cell.checkIfCellOnVerticalBetweenPoints(firstPoint, secondPoint, cell);
      if (firstPoint.y === secondPoint.y) return Cell.checkIfCellOnHorizontalBetweenPoints(firstPoint, secondPoint, cell);
      return false;
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
