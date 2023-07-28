import { type EColors } from "@/types/cell/ECellColors";
import Cell from "./cell";
import { type ICellPosition } from "@/types/cell/TCellNumbers";
import type Board from "./board";
import { type IPossibleAction, type IMoveInfo } from "@/types/IMove";
import { type TDiagonalDirections } from "../pieces/utils/diagonalFigure";
import { type TLinearDirections, type TVerticalDirections, type THorizontalDirections } from "../pieces/utils/linearFigure";
import type Queen from "../pieces/queen";
import type Rock from "../pieces/rock";
import type Bishop from "../pieces/bishop";
import type King from "../pieces/king";

export type FigureConstructor = new (position: ICellPosition, color: EColors, board: Board) => Figure;
export type TDirections = TLinearDirections | TDiagonalDirections;

export enum EFigures {
   pawn = "pawn",
   rock = "rock",
   knight = "knight",
   bishop = "bishop",
   queen = "queen",
   king = "king",
}

export interface IFigure {
   figureColor: EColors;
   isAlive: boolean;
   figureName: EFigures | null;
   board: Board;
   possibleMoves: IMoveInfo[];
   possibleAttacks: IMoveInfo[];
   findAllActions: (board?: Board) => IMoveInfo[];
   isShieldForKing: () => TDirections | false;
}

export default abstract class Figure extends Cell implements IFigure {
   isAlive: boolean;
   figureColor: EColors;
   board: Board;
   readonly figureName: EFigures | null = null;

   protected allActions: IPossibleAction[] = [];

   constructor(position: ICellPosition, color: EColors, board: Board) {
      super(position);
      this.isAlive = true;
      this.figureColor = color;
      this.board = board;
   }

   static checkIsEnemy(firstFigure: Figure, secondFigure: Figure): boolean {
      return firstFigure.figureColor !== secondFigure.figureColor;
   }

   get possibleMoves(): IMoveInfo[] {
      return this.allActions.filter((possibleMove) => possibleMove.possible && possibleMove.info !== "attackWithoutMove");
   }

   get possibleAttacks(): IMoveInfo[] {
      return this.allActions.filter(
         (possibleAttack) => possibleAttack.info === undefined || possibleAttack.info === "capture" || possibleAttack.info === "attackWithoutMove"
      );
   }

   private isVerticalShieldForKing(direction: TVerticalDirections, kingY: number): TVerticalDirections | false {
      const divY = direction === "forward" ? -1 : 1;
      let cellY = this.position.y + divY;

      while (cellY !== kingY) {
         // check for cells are empty between figure and king
         const possibleFigure = this.board.getCellByPosition({ x: this.position.x, y: cellY });
         if (possibleFigure instanceof Figure) return false;
         cellY += divY;
      }

      cellY = this.position.y - divY;

      while (cellY >= 0 && cellY <= 7) {
         // check for figure attacked by linear figure
         const possibleFigure = this.board.getCellByPosition({ x: this.position.x, y: cellY });
         cellY += -divY;
         if (!(possibleFigure instanceof Figure)) continue;
         if (possibleFigure.isLinearFigure() && possibleFigure.figureColor !== this.figureColor) return direction;
      }

      return false;
   }

   private isHorizontalShieldForKing(direction: THorizontalDirections, kingX: number): THorizontalDirections | false {
      const divX = direction === "right" ? -1 : 1;
      let cellX = this.position.x + divX;

      while (cellX !== kingX) {
         // check for cells are empty between figure and king
         const possibleFigure = this.board.getCellByPosition({ x: cellX, y: this.position.y });
         if (possibleFigure instanceof Figure) return false;
         cellX += divX;
      }

      cellX = this.position.x - divX;

      while (cellX >= 0 && cellX <= 7) {
         // check for figure attacked by linear figure
         const possibleFigure = this.board.getCellByPosition({ x: cellX, y: this.position.y });
         cellX += -divX;
         if (!(possibleFigure instanceof Figure)) continue;
         if (possibleFigure.isLinearFigure() && possibleFigure.figureColor !== this.figureColor) {
            return direction;
         }
      }

      return false;
   }

   private isDiagonalShieldForKing(protectionDirection: TDiagonalDirections, kingPosition: ICellPosition): TDiagonalDirections | false {
      let divX: number;
      let divY: number;
      switch (protectionDirection) {
         case "forward-right":
            divX = -1;
            divY = -1;
            break;
         case "backward-right":
            divX = -1;
            divY = 1;
            break;
         case "backward-left":
            divX = 1;
            divY = 1;
            break;
         case "forward-left":
            divX = 1;
            divY = -1;
            break;
      }
      const { x: kingX, y: kingY } = kingPosition;

      let cellX = this.position.x + divX;
      let cellY = this.position.y + divY;

      while (cellX !== kingX && cellY !== kingY) {
         const possibleFigure = this.board.getCellByPosition({ x: cellX, y: cellY });
         if (possibleFigure instanceof Figure) return false;
         cellX += divX;
         cellY += divY;
      }

      cellX = this.position.x - divX;
      cellY = this.position.y - divY;

      while (cellX >= 0 && cellX <= 7 && cellY >= 0 && cellY <= 7) {
         const possibleFigure = this.board.getCellByPosition({ x: cellX, y: cellY });
         cellX += -divX;
         cellY += -divY;
         if (!(possibleFigure instanceof Figure)) continue;
         if (possibleFigure.isDiagonalFigure() && possibleFigure.figureColor !== this.figureColor) return protectionDirection;
         return false;
      }

      return false;
   }

   isShieldForKing(): TDirections | false {
      const { position: figurePosition } = this;
      const { position: kingPosition } = this.board.getKing(this.figureColor);

      if (figurePosition.x === kingPosition.x) {
         if (figurePosition.y > kingPosition.y) return this.isVerticalShieldForKing("forward", kingPosition.y);
         if (figurePosition.y < kingPosition.y) return this.isVerticalShieldForKing("backward", kingPosition.y);
      }

      if (figurePosition.y === kingPosition.y) {
         if (figurePosition.x > kingPosition.x) return this.isHorizontalShieldForKing("right", kingPosition.x);
         if (figurePosition.x < kingPosition.x) return this.isHorizontalShieldForKing("left", kingPosition.x);
      }

      if (Math.abs(figurePosition.y - kingPosition.y) === Math.abs(figurePosition.x - kingPosition.x)) {
         if (figurePosition.x > kingPosition.x && figurePosition.y > kingPosition.y)
            return this.isDiagonalShieldForKing("forward-right", kingPosition);
         if (figurePosition.x > kingPosition.x && figurePosition.y < kingPosition.y)
            return this.isDiagonalShieldForKing("backward-right", kingPosition);
         if (figurePosition.x < kingPosition.x && figurePosition.y > kingPosition.y)
            return this.isDiagonalShieldForKing("forward-left", kingPosition);
         if (figurePosition.x < kingPosition.x && figurePosition.y < kingPosition.y)
            return this.isDiagonalShieldForKing("backward-left", kingPosition);
      }

      return false;
   }

   abstract findAllActions(board?: Board): IMoveInfo[];

   bindBoard(board: Board): void {
      this.board = board;
   }

   private isBishop(): this is Bishop {
      return this.figureName === EFigures.bishop;
   }

   private isRock(): this is Rock {
      return this.figureName === EFigures.rock;
   }

   private isKing(): this is King {
      return this.figureName === EFigures.king;
   }

   isQueen(): this is Queen {
      return this.figureName === EFigures.queen;
   }

   isDiagonalFigure(): boolean {
      return this.isBishop() || this.isQueen();
   }

   isLinearFigure(): boolean {
      return this.isRock() || this.isQueen();
   }
}
