// import { applyMixins } from "@/utils/functions";
// import type Board from "../main/board";
// import Cell from "../main/cell";
// import { type TDiagonalDirections } from "../pieces/utils/diagonalFigure";
// import { type THorizontalDirections, type TVerticalDirections, type TLinearDirections } from "../pieces/utils/linearFigure";
// import { type IPossibleMove } from "../../types/IMove";
// import { EColors } from "../../types/cell/ECellColors";
// import { type ICellPosition } from "../../types/cell/TCellNumbers";

// export type FigureConstructor = new (position: ICellPosition, color: EColors, board: Board) => Figure;
// type TDirections = TLinearDirections | TDiagonalDirections;

// export interface IFigure {
//    figureColor: EColors;
//    isAlive: boolean;
//    board: Board;
//    possibleMoves: IPossibleMove[];
//    calculatePossibleMoves: () => IPossibleMove[];
//    isShieldForKing: () => TDirections | false;
// }

// export abstract class Figure extends Cell implements IFigure {
//    isAlive: boolean;
//    figureColor: EColors;
//    board: Board;
//    private _possibleMoves: IPossibleMove[] = [];

//    constructor(position: ICellPosition, color: EColors, board: Board) {
//       super(position);
//       this.isAlive = true;
//       this.figureColor = color;
//       this.board = board;
//    }

//    static checkIsEnemy(firstFigure: Figure, secondFigure: Figure): boolean {
//       return firstFigure.figureColor !== secondFigure.figureColor;
//    }

//    get possibleMoves(): IPossibleMove[] {
//       return this._possibleMoves;
//    }

//    protected set possibleMoves(possibleMoves: IPossibleMove[]) {
//       this._possibleMoves = possibleMoves;
//    }

//    private isVerticalShieldForKing(direction: TVerticalDirections, kingY: number): TVerticalDirections | false {
//       const divY = direction === "forward" ? -1 : 1;
//       let cellY = this.position.y + divY;

//       while (cellY !== kingY) {
//          // check for cells are empty between figure and king
//          const possibleFigure = this.board.getCellByPosition({ x: this.position.x, y: cellY });
//          if (possibleFigure instanceof Figure) return false;
//          cellY += divY;
//       }

//       cellY = this.position.y - divY;

//       while (cellY >= 0 && cellY <= 7) {
//          // check for figure attacked by linear figure
//          const possibleFigure = this.board.getCellByPosition({ x: this.position.x, y: cellY });
//          cellY += -divY;
//          if (!(possibleFigure instanceof Figure)) continue;
//          if (possibleFigure.isLinearFigure() && possibleFigure.figureColor !== this.figureColor) return direction;
//       }

//       return false;
//    }

//    private isHorizontalShieldForKing(direction: THorizontalDirections, kingX: number): THorizontalDirections | false {
//       const divX = direction === "right" ? -1 : 1;
//       let cellX = this.position.x + divX;

//       while (cellX !== kingX) {
//          // check for cells are empty between figure and king
//          const possibleFigure = this.board.getCellByPosition({ x: cellX, y: this.position.y });
//          if (possibleFigure instanceof Figure) return false;
//          cellX += divX;
//       }

//       cellX = this.position.y - divX;

//       while (cellX >= 0 && cellX <= 7) {
//          // check for figure attacked by linear figure
//          const possibleFigure = this.board.getCellByPosition({ x: cellX, y: this.position.y });
//          cellX += -cellX;
//          if (!(possibleFigure instanceof Figure)) continue;
//          if (possibleFigure.isRock() && possibleFigure.figureColor !== this.figureColor) return direction;
//       }

//       return false;
//    }

//    isShieldForKing(): TDirections | false {
//       const { position: figurePosition } = this;
//       const { position: kingPosition } = this.board.getKing(this.figureColor);

//       if (figurePosition.x === kingPosition.x) {
//          if (figurePosition.y > kingPosition.y) this.isVerticalShieldForKing("forward", kingPosition.y);
//          // if (figurePosition.y < kingPosition.y) this.isVerticalShieldForKing("backward", kingPosition.y);
//       }

//       if (figurePosition.y === kingPosition.y) {
//          // if (figurePosition.x > kingPosition.x) this.isHorizontalShieldForKing("right", kingPosition.x);
//          // if (figurePosition.x < kingPosition.x) this.isHorizontalShieldForKing("left", kingPosition.x);
//       }

//       if (Math.abs(figurePosition.y - kingPosition.y) === Math.abs(figurePosition.x - kingPosition.x)) {
//          if (figurePosition.x > kingPosition.x && figurePosition.y > kingPosition.y) return "forward-right";
//          if (figurePosition.x > kingPosition.x && figurePosition.y < kingPosition.y) return "backward-right";
//          if (figurePosition.x < kingPosition.x && figurePosition.y > kingPosition.y) return "forward-left";
//          if (figurePosition.x < kingPosition.x && figurePosition.y < kingPosition.y) return "backward-left";
//       }

//       return false;
//    }

//    abstract calculatePossibleMoves(): IPossibleMove[];

//    isLinearFigure(): boolean {
//       return this.isRock() || this.isQueen();
//    }

//    private isRock(): this is Rock {
//       return this instanceof Rock;
//    }

//    private isQueen(): this is Queen {
//       return this instanceof Queen;
//    }

//    // static isLinearFigure(figure: Figure): boolean {
//    //    return false;
//    // }
// }

// interface IPawn {}

// export class Pawn extends Figure implements IPawn {
//    calculatePossibleMoves(): IPossibleMove[] {
//       this.isShieldForKing();

//       const possibleMoves: IPossibleMove[] = [];

//       const isCaptureLeftCell = this.checkForCapture("left");
//       if (isCaptureLeftCell) {
//          possibleMoves.push({ position: isCaptureLeftCell.position, info: "capture" });
//       }
//       const isCaptureRightCell = this.checkForCapture("right");
//       if (isCaptureRightCell) {
//          possibleMoves.push({ position: isCaptureRightCell.position, info: "capture" });
//       }
//       const isNextMoveCell = this.checkForNextMove();
//       if (isNextMoveCell) {
//          possibleMoves.push(isNextMoveCell);
//       }
//       const isLongMoveCell = this.checkForLongMove();
//       if (isLongMoveCell) {
//          possibleMoves.push(isLongMoveCell);
//       }
//       const isEnPassant = this.checkForEnPassant();
//       if (isEnPassant) {
//          possibleMoves.push({ position: isEnPassant.position, info: "enPassant" });
//       }

//       this.possibleMoves = possibleMoves;

//       return possibleMoves;
//    }

//    private checkForNextMove(): Cell | false {
//       const delY = this.figureColor === EColors.white ? 1 : -1;
//       const cell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });

//       if (!(cell instanceof Figure)) {
//          return cell;
//       }

//       return false;
//    }

//    private checkForLongMove(): Cell | false {
//       const startPosition = this.figureColor === EColors.white ? 1 : 6;
//       const delY = this.figureColor === EColors.white ? 1 : -1;

//       if (this.position.y === startPosition) {
//          const firstCell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });
//          if (!(firstCell instanceof Figure)) {
//             const secondCell = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + 2 * delY });
//             if (!(secondCell instanceof Figure)) return secondCell;
//          }
//       }

//       return false;
//    }

//    private checkForCapture(side: "left" | "right"): Cell | false {
//       const delY = this.figureColor === EColors.white ? 1 : -1;
//       const delX = side === "left" ? -1 : 1;
//       const edge = side === "left" ? 0 : 7;

//       if (this.position.x !== edge) {
//          const cell = this.board.getCellByPosition({ x: this.position.x + delX, y: this.position.y + delY });
//          if (cell instanceof Figure && Figure.checkIsEnemy(this, cell)) return cell;
//       }

//       return false;
//    }

//    private checkForEnPassant(): Cell | false {
//       const lastMove = this.board.moves.at(-1);
//       if (!lastMove) return false;
//       if (!(lastMove.figure instanceof Pawn)) return false;

//       const { nextPosition, previousPosition } = lastMove;

//       if (this.position.y !== nextPosition.y) return false;
//       if (Math.abs(nextPosition.y - previousPosition.y) !== 2) return false;
//       if (Math.abs(this.position.x - nextPosition.x) !== 1) return false;

//       return this.board.getCellByPosition({
//          x: nextPosition.x,
//          y: (nextPosition.y + previousPosition.y) / 2,
//       });
//    }
// }

// interface IKnight {}

// export class Knight extends Figure implements IKnight {
//    calculatePossibleMoves(): IPossibleMove[] {
//       const {
//          position: { x, y },
//       } = this;
//       const possibleMoves: IPossibleMove[] = [];

//       for (let delX = -2; delX <= 2; delX += 4) {
//          for (let delY = -1; delY <= 1; delY += 2) {
//             if (x + delX > 7 || x + delX < 0 || y + delY > 7 || y + delY < 0) continue;
//             const possibleMove = this.board.getCellByPosition({ x: x + delX, y: y + delY });
//             if (possibleMove instanceof Figure) {
//                if (Figure.checkIsEnemy(this, possibleMove)) {
//                   possibleMoves.push({ position: possibleMove.position, info: "capture" });
//                }
//                continue;
//             }
//             possibleMoves.push({ position: possibleMove.position });
//          }
//       }

//       for (let delY = -2; delY <= 2; delY += 4) {
//          for (let delX = -1; delX <= 1; delX += 2) {
//             if (x + delX > 7 || x + delX < 0 || y + delY > 7 || y + delY < 0) continue;

//             const possibleMove: IPossibleMove = this.board.getCellByPosition({ x: x + delX, y: y + delY });
//             if (possibleMove instanceof Figure) {
//                if (Figure.checkIsEnemy(this, possibleMove)) {
//                   possibleMoves.push({ position: possibleMove.position, info: "capture" });
//                }
//                continue;
//             }
//             possibleMoves.push({ position: possibleMove.position });
//          }
//       }

//       this.possibleMoves = possibleMoves;
//       return possibleMoves;
//    }
// }

// abstract class LinearFigure extends Figure {
//    getLinearPossibleMoves(): IPossibleMove[] {
//       const leftMoves: IPossibleMove[] = this.getHorizontalSideMoves("left");
//       const rightMoves: IPossibleMove[] = this.getHorizontalSideMoves("right");
//       const forwardMoves: IPossibleMove[] = this.getVerticalMoves("forward");
//       const backwardMoves: IPossibleMove[] = this.getVerticalMoves("backward");

//       return [...leftMoves, ...rightMoves, ...forwardMoves, ...backwardMoves];
//    }

//    getHorizontalSideMoves(side: THorizontalDirections): IPossibleMove[] {
//       const horizontalSideMoves: IPossibleMove[] = [];
//       const edge = side === "left" ? 0 : 7;
//       const stepDelX = side === "left" ? -1 : 1;
//       let delX = 0;
//       while (this.position.x + delX !== edge) {
//          delX += stepDelX;
//          const possibleMove = this.board.getCellByPosition({ x: this.position.x + delX, y: this.position.y });
//          if (possibleMove instanceof Figure) {
//             if (possibleMove.figureColor !== this.figureColor) {
//                horizontalSideMoves.push({ position: possibleMove.position, info: "capture" });
//             }
//             break;
//          }
//          horizontalSideMoves.push({ position: possibleMove.position });
//       }

//       return horizontalSideMoves;
//    }

//    getVerticalMoves(side: TVerticalDirections): IPossibleMove[] {
//       const verticalSideMoves: IPossibleMove[] = [];
//       const edge = side === "backward" ? 0 : 7;
//       const stepDelY = side === "backward" ? -1 : 1;
//       let delY = 0;
//       while (this.position.y + delY !== edge) {
//          delY += stepDelY;
//          const possibleMove = this.board.getCellByPosition({ x: this.position.x, y: this.position.y + delY });
//          if (possibleMove instanceof Figure) {
//             if (possibleMove.figureColor !== this.figureColor) {
//                verticalSideMoves.push({ position: possibleMove.position, info: "capture" });
//             }
//             break;
//          }
//          verticalSideMoves.push({ position: possibleMove.position });
//       }

//       return verticalSideMoves;
//    }
// }

// interface IRock extends IFigure {
//    wereMoved: boolean;
// }

// export class Rock extends LinearFigure implements IRock {
//    wereMoved: boolean;

//    constructor(position: ICellPosition, color: EColors, board: Board) {
//       super(position, color, board);
//       this.wereMoved = false;
//    }

//    calculatePossibleMoves(): IPossibleMove[] {
//       this.possibleMoves = this.getLinearPossibleMoves();
//       return this.possibleMoves;
//    }
// }

// abstract class DiagonalFigure extends Figure {
//    getDiagonalPossibleMoves(): IPossibleMove[] {
//       const forwardRightMoves = this.getDiagonalMoves("forward-right");
//       const backwardRightMoves = this.getDiagonalMoves("backward-right");
//       const backwardLeftMoves = this.getDiagonalMoves("backward-left");
//       const forwardLeftMoves = this.getDiagonalMoves("forward-left");

//       return [...forwardRightMoves, ...backwardRightMoves, ...backwardLeftMoves, ...forwardLeftMoves];
//    }

//    getDiagonalMoves(direction: TDiagonalDirections): IPossibleMove[] {
//       const diagonalMoves: IPossibleMove[] = [];
//       let stepDelX: number;
//       let stepDelY: number;
//       let edgeX: number;
//       let edgeY: number;
//       switch (direction) {
//          case "forward-right":
//             stepDelX = 1;
//             stepDelY = 1;
//             edgeX = 7;
//             edgeY = 7;
//             break;
//          case "backward-right":
//             stepDelX = 1;
//             stepDelY = -1;
//             edgeX = 7;
//             edgeY = 0;
//             break;
//          case "backward-left":
//             stepDelX = -1;
//             stepDelY = -1;
//             edgeX = 0;
//             edgeY = 0;
//             break;
//          case "forward-left":
//             stepDelX = -1;
//             stepDelY = 1;
//             edgeX = 0;
//             edgeY = 7;
//             break;
//       }

//       let delX = 0;
//       let delY = 0;

//       while (this.position.x + delX !== edgeX && this.position.y + delY !== edgeY) {
//          delX += stepDelX;
//          delY += stepDelY;
//          const possibleMove = this.board.getCellByPosition({ x: this.position.x + delX, y: this.position.y + delY });
//          if (possibleMove instanceof Figure) {
//             if (possibleMove.figureColor !== this.figureColor) {
//                diagonalMoves.push({ position: possibleMove.position, info: "capture" });
//             }
//             break;
//          }
//          diagonalMoves.push({ position: possibleMove.position });
//       }

//       return diagonalMoves;
//    }
// }

// interface IBishop {}

// export class Bishop extends DiagonalFigure implements IBishop {
//    calculatePossibleMoves(): Cell[] {
//       this.possibleMoves = this.getDiagonalPossibleMoves();
//       return this.possibleMoves;
//    }
// }

// interface IQueen {}

// interface Queen extends LinearFigure, DiagonalFigure {}

// class Queen extends Figure implements IQueen {
//    calculatePossibleMoves(): Cell[] {
//       this.possibleMoves = [...this.getDiagonalPossibleMoves(), ...this.getLinearPossibleMoves()];
//       return this.possibleMoves;
//    }
// }

// applyMixins(Queen, [LinearFigure, DiagonalFigure]);

// export { Queen };

// interface IKing {}

// export class King extends Figure implements IKing {
//    calculatePossibleMoves(): Cell[] {
//       // const { position } = this;
//       // const allMoves = [];
//       // for (let x = -1; x <= 1; x++) {
//       //    for (let y = -1; y <= 1; y++) {
//       //       if (x === 0 && y ===0) continue
//       //       allMoves.push()
//       //    }
//       // }
//       return [];
//    }
// }
