import type Figure from "@/models/main/figure";
import type King from "@/models/pieces/king";
import type Knight from "@/models/pieces/knight";
import type Pawn from "@/models/pieces/pawn";
import type Rock from "@/models/pieces/rock";
import { type DiagonalFigure } from "@/models/pieces/utils/diagonalFigure";
import { type LinearFigure } from "@/models/pieces/utils/linearFigure";
import { type ICellPosition } from "./cell/TCellNumbers";
import { type TPawnMoveDescription, type TCommonMoveDescription, type TMoveDescription, type TCastleMoveDescription } from "./MoveDescription";

export interface ITemplateMoveInfo {
   position: ICellPosition;
   info?: TMoveDescription;
   figure: Figure;
}

export interface IPawnMoveInfo extends ITemplateMoveInfo {
   figure: Pawn;
   info?: TPawnMoveDescription | TCommonMoveDescription;
   rock?: never;
}

export interface ICommonMoveInfo extends ITemplateMoveInfo {
   info?: TCommonMoveDescription;
   figure: Knight | DiagonalFigure | LinearFigure;
   rock?: never;
}

export interface IKingCommonMoveInfo extends ITemplateMoveInfo {
   figure: King;
   rock?: never;
   info?: TCommonMoveDescription;
}

export interface IKingCastleMoveInfo extends ITemplateMoveInfo {
   figure: King;
   rock: Rock;
   info: TCastleMoveDescription;
}

export type TKingMoveInfo = IKingCommonMoveInfo | IKingCastleMoveInfo;

export type TMoveInfo = IPawnMoveInfo | ICommonMoveInfo | TKingMoveInfo;

export function isPawnMoveInfo(moveInfo: TMoveInfo): moveInfo is IPawnMoveInfo {
   return moveInfo.figure.isPawn();
}

export function isKingMoveInfo(moveInfo: TMoveInfo): moveInfo is TKingMoveInfo {
   return moveInfo.figure.isKing();
}

export function isCommonMoveInfo(moveInfo: TMoveInfo): moveInfo is ICommonMoveInfo {
   return moveInfo.figure.isKnight() || moveInfo.figure.isBishop() || moveInfo.figure.isRock() || moveInfo.figure.isQueen();
}
