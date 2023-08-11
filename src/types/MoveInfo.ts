import { type TransformationFigure, type EFigures } from "@/models/main/figure";
import { type ICellPosition } from "./cell/TCellNumbers";
import { type TMoveDescription } from "./MoveDescription";
import { type TCommonMoveInfo } from "./moves/CommonMoveInfo";
import { type TKingMoveInfo } from "./moves/KingMoveInfo";
import { type IPawnTransformationMoveInfo, type TPawnMoveInfo } from "./moves/PawnMoveInfo";

export interface IFigureInfo {
   position: ICellPosition;
}
export interface IFigureInfoWithType<T extends EFigures> {
   type: T;
   position: ICellPosition;
}

export interface IMoveDescription<D extends TMoveDescription = TMoveDescription> {
   position: ICellPosition;
   description?: D;
}

export interface IMoveInfoTemplate {
   info: IMoveDescription;
   figure: IFigureInfo;
}

export type TMoveInfoWithoutTransformation = TPawnMoveInfo | TCommonMoveInfo | TKingMoveInfo;

export type TMoveInfoWithTransformation<T extends IPawnTransformationMoveInfo = IPawnTransformationMoveInfo> = T & {
   info: T["info"] & { transformation: TransformationFigure };
};

export type TMoveInfo<T extends TMoveInfoWithoutTransformation = TMoveInfoWithoutTransformation> = T extends IPawnTransformationMoveInfo
   ? TMoveInfoWithTransformation
   : T;
