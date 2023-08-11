import { EFigures } from "@/models/main/figure";
import { type TCommonMoveDescription } from "../MoveDescription";
import { type IMoveInfoTemplate, type IMoveDescription, type IFigureInfoWithType, type TMoveInfoWithoutTransformation } from "../MoveInfo";

export interface ICommonMoveInfoTemplate extends IMoveInfoTemplate {
   info: IMoveDescription<TCommonMoveDescription>;
   rockPosition?: never;
}

export interface IKnightMoveInfo extends ICommonMoveInfoTemplate {
   figure: IFigureInfoWithType<EFigures.knight>;
}

export interface IBishopMoveInfo extends ICommonMoveInfoTemplate {
   figure: IFigureInfoWithType<EFigures.bishop>;
}

export interface IRockMoveInfo extends ICommonMoveInfoTemplate {
   figure: IFigureInfoWithType<EFigures.rock>;
}

export interface IQueenMoveInfo extends ICommonMoveInfoTemplate {
   figure: IFigureInfoWithType<EFigures.queen>;
}

export type TCommonMoveInfo = IKnightMoveInfo | IBishopMoveInfo | IRockMoveInfo | IQueenMoveInfo;

export function isCommonMoveInfo(moveInfo: TMoveInfoWithoutTransformation): moveInfo is TCommonMoveInfo {
   return (
      moveInfo.figure.type === EFigures.knight ||
      moveInfo.figure.type === EFigures.bishop ||
      moveInfo.figure.type === EFigures.rock ||
      moveInfo.figure.type === EFigures.queen
   );
}
