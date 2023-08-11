import { EColors } from "@/types/cell/ECellColors";
import Cell from "./cell";
import { type ICellPosition } from "@/types/cell/TCellNumbers";
import type Board from "./board";
import { type TDiagonalDirections } from "../pieces/utils/diagonalFigure";
import { type TLinearDirections, type TVerticalDirections, type THorizontalDirections } from "../pieces/utils/linearFigure";
import type Queen from "../pieces/queen";
import type Rock from "../pieces/rock";
import type Bishop from "../pieces/bishop";
import type King from "../pieces/king";
import type Knight from "../pieces/knight";
import type Pawn from "../pieces/pawn";
import { cellPositionToString } from "@/utils/functions";
import { type TMoveInfoWithoutTransformation } from "@/types/MoveInfo";

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
export type TransformationFigure = Exclude<EFigures, EFigures.king | EFigures.pawn>;

export interface IFigure {
   figureColor: EColors;
   isAlive: boolean;
   figureName: EFigures | null;
   board: Board;
   possibleMoves: TMoveInfoWithoutTransformation[];
   possibleAttacks: TMoveInfoWithoutTransformation[];
   findAllActions: (board?: Board) => TMoveInfoWithoutTransformation[];
   isShieldForKing: () => TDirections | false;
}

interface ShieldMovesAndProtectionDirectionType<F extends Figure> {
   shieldMoves: Array<TFigureMoveInfo<F>> | null;
   protectionDirection: TDirections | false;
}

type TFigureMoveInfo<F extends Figure> = F["allActions"][0];

export default abstract class Figure extends Cell implements IFigure {
   isAlive: boolean;
   figureColor: EColors;
   board: Board;
   readonly figureName: EFigures | null = null;

   abstract allActions: TMoveInfoWithoutTransformation[];
   protected _possibleMoves: Array<TFigureMoveInfo<this>> = [];

   constructor(position: ICellPosition, color: EColors, board: Board) {
      super(position);
      this.isAlive = true;
      this.figureColor = color;
      this.board = board;
   }

   static checkIsEnemy(firstFigure: Figure, secondFigure: Figure): boolean {
      return firstFigure.figureColor !== secondFigure.figureColor;
   }

   get possibleMoves(): Array<TFigureMoveInfo<this>> {
      return this._possibleMoves.filter(({ info: description }) => description.description !== "attackWithoutMove");
   }

   protected set possibleMoves(value: Array<TFigureMoveInfo<this>>) {
      this._possibleMoves = value;
   }

   get possibleAttacks(): Array<TFigureMoveInfo<this>> {
      return this.allActions.filter(
         ({ info: description }) =>
            description.description === undefined || description.description === "capture" || description.description === "attackWithoutMove"
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

      const isWhite = this.figureColor === EColors.white;
      const attackedFields = isWhite ? this.board.blackAttackedFields : this.board.whiteAttackedFields;
      const attacksMoves = attackedFields.get(cellPositionToString(this.position));

      if (!attacksMoves || !attacksMoves.length) return false;

      for (const {
         figure: { position },
      } of attacksMoves) {
         const figure = this.board.getFigureByPosition(position);

         if (figure.position.x === this.position.x && figure.isLinearFigure()) {
            return direction;
         }
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

      const attackedFields = this.figureColor === EColors.white ? this.board.blackAttackedFields : this.board.whiteAttackedFields;
      const attacksMoves = attackedFields.get(cellPositionToString(this.position));

      if (!attacksMoves || !attacksMoves.length) return false;

      for (const {
         figure: { position },
      } of attacksMoves) {
         const figure = this.board.getFigureByPosition(position);
         if (figure.isLinearFigure() && figure.position.y === this.position.y) {
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

      const attackedFields = this.figureColor === EColors.white ? this.board.blackAttackedFields : this.board.whiteAttackedFields;
      const attacksMoves = attackedFields.get(cellPositionToString(this.position));

      if (!attacksMoves || !attacksMoves.length) return false;

      for (const {
         figure: { position },
      } of attacksMoves) {
         const figure = this.board.getFigureByPosition(position);
         if (figure.isDiagonalFigure() && Cell.checkIfCellsOnTheSameDiagonal(kingPosition, this.position, figure.position))
            return protectionDirection;
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

   protected getProtectionDirectionAndShieldMoves(): ShieldMovesAndProtectionDirectionType<this> {
      const attacksOnKing = this.board.getAttacksOnKing(this.figureColor);
      const protectionDirection = this.isShieldForKing();

      if (attacksOnKing.length > 1 || (attacksOnKing.length === 1 && protectionDirection)) {
         return {
            shieldMoves: [],
            protectionDirection,
         };
      }

      if (attacksOnKing.length) {
         const shieldMoves = this.findShieldedMoves(attacksOnKing[0]);
         this.possibleMoves = shieldMoves;
         return {
            shieldMoves,
            protectionDirection,
         };
      }

      return {
         shieldMoves: null,
         protectionDirection,
      };
   }

   private findShieldedMoves(attackMove: TMoveInfoWithoutTransformation): Array<TFigureMoveInfo<this>> {
      const shieldedMoves: Array<TFigureMoveInfo<this>> = [];

      const {
         info: attackMoveDescription,
         figure: { position: attackFigurePosition },
      } = attackMove;

      const attackFigure = this.board.getFigureByPosition(attackFigurePosition);
      const { position: kingPosition } = attackMoveDescription;

      if (attackFigure.isKnight() || attackFigure.isPawn()) {
         for (const action of this.allActions) {
            const {
               info: { position: actionPosition },
            } = action;
            if (Cell.checkCellsHasSamePosition(actionPosition, attackFigurePosition)) {
               shieldedMoves.push(action);
               return shieldedMoves;
            }
         }
      }

      if (attackFigure.isBishop()) {
         for (const action of this.allActions) {
            const {
               info: { position: actionPosition },
            } = action;
            if (Cell.checkIfCellOnDiagonalBetweenTwoPoints(kingPosition, attackFigurePosition, actionPosition)) {
               shieldedMoves.push(action);
            }
         }
      }

      if (attackFigure.isRock()) {
         for (const action of this.allActions) {
            const {
               info: { position: actionPosition },
            } = action;
            if (Cell.checkIfCellOnLineBetweenTwoPoints(kingPosition, attackFigurePosition, actionPosition)) {
               shieldedMoves.push(action);
            }
         }
      }

      if (attackFigure.isQueen()) {
         let checkFunc: ((firstPoint: ICellPosition, secondPoint: ICellPosition, cell: ICellPosition) => boolean) | null = null;
         if (attackFigurePosition.x === kingPosition.x || attackFigurePosition.y === kingPosition.y)
            checkFunc = Cell.checkIfCellOnLineBetweenTwoPoints;
         if (Math.abs(attackFigurePosition.x - kingPosition.x) === Math.abs(attackFigurePosition.y - kingPosition.y))
            checkFunc = Cell.checkIfCellOnDiagonalBetweenTwoPoints;
         if (!checkFunc) throw "Queen attack error";

         for (const action of this.allActions) {
            const {
               info: { position: actionPosition },
            } = action;
            if (checkFunc(kingPosition, attackFigurePosition, actionPosition)) {
               shieldedMoves.push(action);
            }
         }
      }

      return shieldedMoves;
   }

   abstract findAllActions(board?: Board): TMoveInfoWithoutTransformation[];

   abstract findPossibleMoves(): TMoveInfoWithoutTransformation[];

   bindBoard(board: Board): void {
      this.board = board;
   }

   isPawn(): this is Pawn {
      return this.figureName === EFigures.pawn;
   }

   isKnight(): this is Knight {
      return this.figureName === EFigures.knight;
   }

   isBishop(): this is Bishop {
      return this.figureName === EFigures.bishop;
   }

   isRock(): this is Rock {
      return this.figureName === EFigures.rock;
   }

   isKing(): this is King {
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

   isWhite(): boolean {
      return this.figureColor === EColors.white;
   }
}
