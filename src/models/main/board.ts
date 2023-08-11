import { EColors } from "@/types/cell/ECellColors";
import { type ICellPosition } from "@/types/cell/TCellNumbers";
import Cell from "./cell";
import Bishop from "../pieces/bishop";
import King from "../pieces/king";
import Knight from "../pieces/knight";
import Pawn from "../pieces/pawn";
import Queen from "../pieces/queen";
import Rock from "../pieces/rock";
import Figure, { EFigures } from "./figure";
import { cellPositionToString } from "@/utils/functions";
import { type TMoveInfo, type TMoveInfoWithoutTransformation } from "@/types/MoveInfo";

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
   moves: TMoveInfoWithoutTransformation[];
   whiteAttackedFields: Map<string, TMoveInfoWithoutTransformation[]>;
   blackAttackedFields: Map<string, TMoveInfoWithoutTransformation[]>;
   currentTurn: EColors;

   resetBoard: () => void;
   getCellByPosition: (position: ICellPosition) => Cell;
   makeMove: (move: TMoveInfo) => void;
}

interface IAllMoves {
   whiteMoves: TMoveInfoWithoutTransformation[];
   blackMoves: TMoveInfoWithoutTransformation[];
}

export default class Board implements IBoard {
   cells: Cell[][] = [];
   moves: TMoveInfoWithoutTransformation[] = [];
   blackFigures: IFiguresObject;
   whiteFigures: IFiguresObject;
   currentTurn: EColors = EColors.white;
   whiteAttackedFields = new Map<string, TMoveInfoWithoutTransformation[]>();
   blackAttackedFields = new Map<string, TMoveInfoWithoutTransformation[]>();

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
      const attackedFields: Map<string, TMoveInfoWithoutTransformation[]> = isWhite ? this.whiteAttackedFields : this.blackAttackedFields;

      attackedFields.clear();

      for (const [key, figuresOrKing] of Object.entries(figureObject) as Entries<IFiguresObject>) {
         if (key === "king") {
            const king = figuresOrKing;
            king.findAllActions();

            for (const possibleAttack of figuresOrKing.possibleAttacks) {
               const cellPositionString = cellPositionToString(possibleAttack.info.position);
               const fieldInfo = attackedFields.get(cellPositionString);
               attackedFields.set(cellPositionString, fieldInfo ? [...fieldInfo, possibleAttack] : [possibleAttack]);
            }

            continue;
         }

         const figures = figuresOrKing;
         for (const figure of figures) {
            if (!figure.isAlive) continue;
            figure.findAllActions();

            for (const possibleAttack of figure.possibleAttacks) {
               const cellPositionString = cellPositionToString(possibleAttack.info.position);
               const fieldInfo = attackedFields.get(cellPositionString);
               attackedFields.set(cellPositionString, fieldInfo ? [...fieldInfo, possibleAttack] : [possibleAttack]);
            }
         }
      }
   }

   private updateFiguresPossibleMoves(color: EColors): TMoveInfoWithoutTransformation[] {
      const isWhite = color === EColors.white;
      const figureObject = isWhite ? this.whiteFigures : this.blackFigures;

      const figuresPossibleMoves: TMoveInfoWithoutTransformation[] = [];

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

   getAttacksOnKing(color: EColors): TMoveInfoWithoutTransformation[] {
      const isWhite = color === EColors.white;
      const king = this.getKing(color);
      const attackedFields = isWhite ? this.blackAttackedFields : this.whiteAttackedFields;
      return attackedFields.get(cellPositionToString(king.position)) ?? [];
   }

   getKing(figureColor: EColors): King {
      const isWhite = figureColor === EColors.white;
      return isWhite ? this.whiteFigures.king : this.blackFigures.king;
   }

   resetBoard(): void {
      this.whiteFigures = this.initiateFigures(EColors.white);
      this.blackFigures = this.initiateFigures(EColors.black);
      this.whiteAttackedFields = new Map<string, TMoveInfoWithoutTransformation[]>();
      this.blackAttackedFields = new Map<string, TMoveInfoWithoutTransformation[]>();
      this.updateBoard();
      this.updateActions();
   }

   makeMove(move: TMoveInfo): void {
      const isWhite = this.currentTurn === EColors.white;
      const {
         info: { position: movePosition },
         figure: { position: figurePosition },
      } = move;
      const figure: Figure = this.getFigureByPosition(figurePosition);

      if (!figure) throw "Figure didn't found";

      if (move.info.description === "capture" || move.info.description === "transformation-capture") {
         const figureToCapture = this.getCellByPosition(movePosition);
         const isNextPositionFigure = figureToCapture instanceof Figure;
         if (!isNextPositionFigure) throw "Next position is not a figure";
         figureToCapture.isAlive = false;
      }

      if (move.info.description === "enPassant") {
         const pawnToCapture = this.getFigureByPosition(
            isWhite ? { ...movePosition, y: movePosition.y - 1 } : { ...movePosition, y: movePosition.y + 1 }
         );
         const isNextPositionPawn = pawnToCapture instanceof Pawn;
         if (!isNextPositionPawn) throw "Next position is not a pawn";
         pawnToCapture.isAlive = false;
      }

      if (move.info.description === "transformation" || move.info.description === "transformation-capture") {
         const figuresObject = isWhite ? this.whiteFigures : this.blackFigures;
         const figureColor = isWhite ? EColors.white : EColors.black;

         switch (move.info.transformation) {
            case EFigures.knight:
               figuresObject.knights.push(new Knight(movePosition, figureColor, this));
               break;
            case EFigures.bishop:
               figuresObject.bishops.push(new Bishop(movePosition, figureColor, this));
               break;
            case EFigures.rock:
               figuresObject.rocks.push(new Rock(movePosition, figureColor, this, true));
               break;
            case EFigures.queen:
               figuresObject.queens.push(new Queen(movePosition, figureColor, this));
               break;
         }

         figure.isAlive = false;
      }

      if (move.info.description === "long-castle" || move.info.description === "short-castle") {
         const { rockPosition } = move.info;
         const rock = this.getFigureByPosition(rockPosition);
         if (move.info.description === "short-castle") {
            rock.position = { y: movePosition.y, x: movePosition.x - 1 };
         } else {
            rock.position = { y: movePosition.y, x: movePosition.x + 1 };
         }
      }

      figure.position = movePosition;
      if (figure.isRock() || figure.isKing()) figure.wereMoved = true;
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

   getFigureByPosition(position: ICellPosition): Figure {
      const cell = this.getCellByPosition(position);
      if (cell instanceof Figure) return cell;

      throw "Cell is not a Figure";
   }
}
