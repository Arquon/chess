import { type ICellPosition } from "@/types/cell/TCellNumbers";

interface ICell {
   position: ICellPosition;
}

export default class Cell implements ICell {
   position: ICellPosition;

   constructor(position: ICellPosition) {
      this.position = position;
   }

   static checkCellsHasSamePosition(firstPoint: ICellPosition, secondPoint: ICellPosition): boolean {
      return firstPoint.x === secondPoint.x && firstPoint.y === secondPoint.y;
   }

   static checkCellsAreTheSame(firstCell: Cell, secondCell: Cell): boolean {
      return this.checkCellsHasSamePosition(firstCell.position, secondCell.position) && firstCell.constructor === secondCell.constructor;
   }

   static checkIfCellOnDiagonalBetweenTwoPoints(firstPoint: ICellPosition, secondPoint: ICellPosition, cell: ICellPosition): boolean {
      const isDiagonal = Math.abs(secondPoint.x - firstPoint.x) === Math.abs(secondPoint.y - firstPoint.y);
      if (!isDiagonal) return false;

      const maxX = Math.max(firstPoint.x, secondPoint.x);
      const minX = Math.min(firstPoint.x, secondPoint.x);
      const maxY = Math.max(firstPoint.y, secondPoint.y);
      const minY = Math.min(firstPoint.y, secondPoint.y);

      const isCellInRectangle = minX <= cell.x && cell.x <= maxX && minY <= cell.y && cell.y <= maxY;

      return isCellInRectangle && Math.abs(cell.x - firstPoint.x) === Math.abs(cell.y - firstPoint.y);
   }

   static checkIfCellsOnTheSameDiagonal(firstPoint: ICellPosition, secondPoint: ICellPosition, thirdPoint: ICellPosition): boolean {
      const isDiagonal = Math.abs(secondPoint.x - firstPoint.x) === Math.abs(secondPoint.y - firstPoint.y);
      if (!isDiagonal) return false;

      return Math.abs(thirdPoint.x - firstPoint.x) === Math.abs(thirdPoint.y - firstPoint.y);
   }

   static checkIfCellsOnTheSameHorizontal(firstPoint: ICellPosition, secondPoint: ICellPosition, thirdPoint: ICellPosition): boolean {
      return firstPoint.y === secondPoint.y && secondPoint.y === thirdPoint.y;
   }

   static checkIfCellsOnTheSameVertical(firstPoint: ICellPosition, secondPoint: ICellPosition, thirdPoint: ICellPosition): boolean {
      return firstPoint.x === secondPoint.x && secondPoint.x === thirdPoint.x;
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
