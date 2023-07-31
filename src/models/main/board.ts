import { type IMove, type IMoveInfo } from "@/types/IMove";
import { EColors } from "@/types/cell/ECellColors";
import { type ICellPosition } from "@/types/cell/TCellNumbers";
import Cell from "./cell";
import Bishop from "../pieces/bishop";
import King from "../pieces/king";
import Knight from "../pieces/knight";
import Pawn from "../pieces/pawn";
import Queen from "../pieces/queen";
import Rock from "../pieces/rock";
import Figure from "./figure";
import { cellPositionToString } from "@/utils/functions";

type Entries<T> = Array<
   {
      [K in keyof T]: [K, T[K]];
   }[keyof T]
>;

interface IFiguresObject {
   pawns: Pawn[];
   rocks: Rock[];
   knights: Knight[];
   bishops: Bishop[];
   queens: Queen[];
   king: King;
}

interface IBoard {
   cells: Cell[][];
   moves: IMove[];
   whiteAttackedFields: Map<string, IMoveInfo[]>;
   blackAttackedFields: Map<string, IMoveInfo[]>;
   currentTurn: EColors;

   resetBoard: () => void;
   getCellByPosition: (position: ICellPosition) => Cell;
   makeMove: (move: IMove) => void;
}

interface IAllMoves {
   whiteMoves: IMoveInfo[];
   blackMoves: IMoveInfo[];
}

export default class Board implements IBoard {
   cells: Cell[][] = [];
   moves: IMove[] = [];
   private blackFigures: IFiguresObject;
   whiteFigures: IFiguresObject;
   currentTurn: EColors = EColors.white;
   whiteAttackedFields = new Map<string, IMoveInfo[]>();
   blackAttackedFields = new Map<string, IMoveInfo[]>();

   constructor();
   constructor(board: Board);
   constructor(board?: Board) {
      if (board) {
         const { cells, moves, whiteFigures, blackFigures, currentTurn } = board;
         this.cells = cells;
         this.moves = moves;
         Board.reBindBoard(whiteFigures, this);
         this.whiteFigures = whiteFigures;
         Board.reBindBoard(blackFigures, this);
         this.blackFigures = blackFigures;
         this.currentTurn = currentTurn;
      } else {
         this.whiteFigures = this.initiateFigures(EColors.white);
         this.blackFigures = this.initiateFigures(EColors.black);
         this.updateBoard();
         this.updateActions();
      }
   }

   static reBindBoard(figureObject: IFiguresObject, board: Board): void {
      for (const [key, figuresOrKing] of Object.entries(figureObject) as Entries<IFiguresObject>) {
         if (key === "king") {
            figuresOrKing.bindBoard(board);
            continue;
         }

         for (const figure of figuresOrKing) {
            figure.bindBoard(board);
         }
      }
   }

   private initiateFigures(figureColor: EColors): IFiguresObject {
      const isWhite = figureColor === EColors.white;
      const figureYPosition = isWhite ? 0 : 7;
      const pawnYPosition = isWhite ? 1 : 6;

      const figuresObject: IFiguresObject = {
         pawns: [],
         rocks: [],
         knights: [],
         bishops: [],
         queens: [],
         king: new King({ x: 4, y: figureYPosition }, figureColor, this),
      };

      figuresObject.rocks.push(new Rock({ x: 0, y: figureYPosition }, figureColor, this));
      figuresObject.rocks.push(new Rock({ x: 7, y: figureYPosition }, figureColor, this));
      figuresObject.knights.push(new Knight({ x: 1, y: figureYPosition }, figureColor, this));
      figuresObject.knights.push(new Knight({ x: 6, y: figureYPosition }, figureColor, this));
      figuresObject.bishops.push(new Bishop({ x: 2, y: figureYPosition }, figureColor, this));
      figuresObject.bishops.push(new Bishop({ x: 5, y: figureYPosition }, figureColor, this));
      figuresObject.queens.push(new Queen({ x: 3, y: figureYPosition }, figureColor, this));

      figuresObject.pawns = [];
      for (let x = 0; x < 8; x++) {
         figuresObject.pawns.push(new Pawn({ x, y: pawnYPosition }, figureColor, this));
      }

      return figuresObject;
   }

   private updateBoard(): void {
      for (let x = 0; x < 8; x += 1) {
         this.cells[x] = [];
         for (let y = 0; y < 8; y += 1) {
            this.cells[x][y] = new Cell({ x, y });
         }
      }

      for (const [key, figures] of Object.entries(this.whiteFigures) as Entries<IFiguresObject>) {
         if (key === "king") {
            this.cells[figures.position.x][figures.position.y] = figures;
            continue;
         }
         for (const figure of figures) {
            if (!figure.isAlive) continue;
            this.cells[figure.position.x][figure.position.y] = figure;
         }
      }

      for (const [key, figures] of Object.entries(this.blackFigures) as Entries<IFiguresObject>) {
         if (key === "king") {
            this.cells[figures.position.x][figures.position.y] = figures;
            continue;
         }
         for (const figure of figures) {
            if (!figure.isAlive) continue;
            this.cells[figure.position.x][figure.position.y] = figure;
         }
      }
   }

   private updateActions(): IAllMoves {
      this.updateFiguresActions(EColors.white);
      this.updateFiguresActions(EColors.black);
      const whiteMoves = this.updateFiguresPossibleMoves(EColors.white);
      const blackMoves = this.updateFiguresPossibleMoves(EColors.black);

      return {
         whiteMoves,
         blackMoves,
      };
   }

   private updateFiguresActions(color: EColors): void {
      const isWhite = color === EColors.white;
      const figureObject = isWhite ? this.whiteFigures : this.blackFigures;
      const attackedFields: Map<string, IMoveInfo[]> = isWhite ? this.whiteAttackedFields : this.blackAttackedFields;

      attackedFields.clear();

      for (const [key, figuresOrKing] of Object.entries(figureObject) as Entries<IFiguresObject>) {
         if (key === "king") {
            figuresOrKing.findAllActions();
            for (const possibleAttack of figuresOrKing.possibleAttacks) {
               const cellPositionString = cellPositionToString(possibleAttack.position);
               const fieldInfo = attackedFields.get(cellPositionString);
               attackedFields.set(cellPositionString, fieldInfo ? [...fieldInfo, possibleAttack] : [possibleAttack]);
            }
            continue;
         }

         for (const figure of figuresOrKing) {
            if (!figure.isAlive) continue;
            figure.findAllActions();
            for (const possibleAttack of figure.possibleAttacks) {
               const cellPositionString = cellPositionToString(possibleAttack.position);
               const fieldInfo = attackedFields.get(cellPositionString);
               attackedFields.set(cellPositionString, fieldInfo ? [...fieldInfo, possibleAttack] : [possibleAttack]);
            }
         }
      }
   }

   private updateFiguresPossibleMoves(color: EColors): IMoveInfo[] {
      const isWhite = color === EColors.white;
      const figureObject = isWhite ? this.whiteFigures : this.blackFigures;

      const figuresPossibleMoves: IMoveInfo[] = [];

      for (const [key, figuresOrKing] of Object.entries(figureObject) as Entries<IFiguresObject>) {
         if (key === "king") {
            figuresOrKing.findPossibleMoves();
            figuresPossibleMoves.push(...figuresOrKing.possibleMoves);
            continue;
         }

         for (const figure of figuresOrKing) {
            if (!figure.isAlive) continue;
            figure.findPossibleMoves();
            figuresPossibleMoves.push(...figure.possibleMoves);
         }
      }

      return figuresPossibleMoves;
   }

   getAttacksOnKing(color: EColors): IMoveInfo[] | undefined {
      const isWhite = color === EColors.white;
      const king = this.getKing(color);
      const attackedFields = isWhite ? this.blackAttackedFields : this.whiteAttackedFields;
      return attackedFields.get(cellPositionToString(king.position));
   }

   getKing(figureColor: EColors): King {
      const isWhite = figureColor === EColors.white;
      return isWhite ? this.whiteFigures.king : this.blackFigures.king;
   }

   resetBoard(): void {
      this.whiteFigures = this.initiateFigures(EColors.white);
      this.blackFigures = this.initiateFigures(EColors.black);
      this.whiteAttackedFields = new Map<string, IMoveInfo[]>();
      this.blackAttackedFields = new Map<string, IMoveInfo[]>();
      this.updateBoard();
      this.updateActions();
   }

   makeMove(move: IMove): void {
      const isWhite = move.figure.figureColor === EColors.white;
      const figureObject = isWhite ? this.whiteFigures : this.blackFigures;
      let figure: Figure | undefined;
      switch (move.figure.constructor) {
         case Rock:
            figure = figureObject.rocks.find((rock) => Cell.checkCellsAreTheSame(rock, move.figure));
            break;
         case Knight:
            figure = figureObject.knights.find((knight) => Cell.checkCellsAreTheSame(knight, move.figure));
            break;
         case Bishop:
            figure = figureObject.bishops.find((bishop) => Cell.checkCellsAreTheSame(bishop, move.figure));
            break;
         case Queen:
            figure = figureObject.queens.find((queen) => Cell.checkCellsAreTheSame(queen, move.figure));
            break;
         case King:
            figure = figureObject.king;
            break;
         case Pawn:
            figure = figureObject.pawns.find((pawn) => Cell.checkCellsAreTheSame(pawn, move.figure));
            break;
      }

      if (!figure) throw "Figure didn't found";

      if (move.info === "capture") {
         const figureToCapture = this.getCellByPosition(move.nextPosition);
         const isNextPositionFigure = figureToCapture instanceof Figure;
         if (!isNextPositionFigure) throw "Next position is not a figure";
         figureToCapture.isAlive = false;
      }

      if (move.info === "enPassant") {
         const pawnToCapture = this.getCellByPosition(
            isWhite ? { ...move.nextPosition, y: move.nextPosition.y - 1 } : { ...move.nextPosition, y: move.nextPosition.y + 1 }
         );
         const isNextPositionPawn = pawnToCapture instanceof Pawn;
         if (!isNextPositionPawn) throw "Next position is not a pawn";
         pawnToCapture.isAlive = false;
      }

      const nextCell = this.getCellByPosition(move.nextPosition);
      const isNextCellFigure = nextCell instanceof Figure;

      if (isNextCellFigure) {
         nextCell.isAlive = false;
      }

      figure.position = move.nextPosition;
      this.moves.push(move);
      this.updateBoard();
      const { whiteMoves, blackMoves } = this.updateActions();
      if (this.currentTurn === EColors.white && !blackMoves.length) console.log("Мат черным");
      if (this.currentTurn === EColors.black && !whiteMoves.length) console.log("Мат белым");
      this.currentTurn = isWhite ? EColors.black : EColors.white;
   }

   getCellByPosition(position: ICellPosition): Cell {
      return this.cells[position.x][position.y];
   }
}
