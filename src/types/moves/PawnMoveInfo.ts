import { EFigures } from "@/models/main/figure";
import { type TTransformationMoveDescription, type TCommonMoveDescription, type TEnPassantMoveDescription } from "../MoveDescription";
import { type IMoveInfoTemplate, type IFigureInfoWithType, type IMoveDescription, type TMoveInfoWithoutTransformation } from "../MoveInfo";

export type TPawnMoveDescription = TTransformationMoveDescription | TCommonMoveDescription | TEnPassantMoveDescription;

export interface IPawnMoveInfoTemplate extends IMoveInfoTemplate {
   figure: IFigureInfoWithType<EFigures.pawn>;
   info: IMoveDescription<TPawnMoveDescription>;
}

export interface IPawnTransformationMoveInfo extends IPawnMoveInfoTemplate {
   info: IMoveDescription<TTransformationMoveDescription>;
}

export interface IPawnCommonMoveInfo extends IPawnMoveInfoTemplate {
   info: IMoveDescription<TCommonMoveDescription | TEnPassantMoveDescription>;
}

export type TPawnMoveInfo = IPawnCommonMoveInfo | IPawnTransformationMoveInfo;

export function isPawnMoveInfo(moveInfo: TMoveInfoWithoutTransformation): moveInfo is TPawnMoveInfo {
   return moveInfo.figure.type === EFigures.pawn;
}

export function isTransformationMoveInfo(moveInfo: TPawnMoveInfo): moveInfo is IPawnTransformationMoveInfo {
   return moveInfo.info.description === "transformation" || moveInfo.info.description === "transformation-capture";
}
