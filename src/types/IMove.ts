import type Figure from "@/models/main/figure";
import { type ICellPosition } from "./cell/TCellNumbers";

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
   figure: Figure;
}
