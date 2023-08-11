import { type TransformationFigure } from "@/models/main/figure";
import { type ICellPosition } from "./cell/TCellNumbers";
import { type TKingMoveInfo, type ICommonMoveInfo, type IPawnMoveInfo } from "./MoveInfo";

interface ITemplateMove {
   previousPosition: ICellPosition;
}

export interface ICommonMove extends ITemplateMove, ICommonMoveInfo {
   transformationFigure?: never;
}

export interface IPawnMove extends ITemplateMove, IPawnMoveInfo {
   transformationFigure?: TransformationFigure;
}

export type TKingMove = ITemplateMove &
   TKingMoveInfo & {
      transformationFigure?: never;
   };

export type TMove = ICommonMove | IPawnMove | TKingMove;
