export type TCastleMoveDescription = "short-castle" | "long-castle";
export type TTransformationMoveDescription = "transformation" | "transformation-capture";
export type TEnPassantMoveDescription = "enPassant";
export type TCommonMoveDescription = "capture" | "moveWithoutAttack" | "attackWithoutMove";
export type TMoveDescription = TCommonMoveDescription | TCastleMoveDescription | TTransformationMoveDescription | TEnPassantMoveDescription;
