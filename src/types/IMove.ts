import type Figure from "@/models/main/figure";
import { type ICellPosition } from "./cell/TCellNumbers";
import { type IFigure } from "@/models/main/figure";

export type TMoveInfo = "capture" | "enPassant" | "castle" | "moveWithoutAttack" | "attackWithoutMove";

export interface IMove {
   previousPosition: ICellPosition;
   nextPosition: ICellPosition;
   info?: TMoveInfo;
   figure: Figure;
}

export interface IMoveInfo {
   position: ICellPosition;
   info?: TMoveInfo;
   figure: IFigure;
}

export interface IPossibleAction extends IMoveInfo {
   possible: boolean;
}
