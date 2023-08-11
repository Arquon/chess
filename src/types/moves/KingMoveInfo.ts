import { EFigures } from "@/models/main/figure";
import { type ICellPosition } from "../cell/TCellNumbers";
import { type TCommonMoveDescription, type TCastleMoveDescription } from "../MoveDescription";
import { type IMoveInfoTemplate, type IFigureInfoWithType, type IMoveDescription, type TMoveInfoWithoutTransformation } from "../MoveInfo";

type TKingMoveDescription = TCommonMoveDescription | TCastleMoveDescription;

interface IKingMoveInfo<T extends TKingMoveDescription = TKingMoveDescription> extends IMoveInfoTemplate {
   figure: IFigureInfoWithType<EFigures.king>;
   info: IMoveDescription<T>;
}

interface ICastleMoveInfo extends IKingMoveInfo {
   info: IKingMoveInfo<TCastleMoveDescription>["info"] & { rockPosition: ICellPosition };
}

export type TKingMoveInfo<T extends TKingMoveDescription = TKingMoveDescription> = T extends TCastleMoveDescription
   ? ICastleMoveInfo
   : IKingMoveInfo<T>;

export function isKingMoveInfo(moveInfo: TMoveInfoWithoutTransformation): moveInfo is TKingMoveInfo {
   return moveInfo.figure.type === EFigures.king;
}

export function isCastleMoveInfo(moveInfo: TKingMoveInfo): moveInfo is ICastleMoveInfo {
   return moveInfo.info.description === "short-castle" || moveInfo.info.description === "long-castle";
}
