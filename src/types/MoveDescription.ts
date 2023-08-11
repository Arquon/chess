export type TCastleMoveDescription = "short-castle" | "long-castle";
export type TPawnMoveDescription = "enPassant" | "transformation" | "transformation-capture";
export type TCommonMoveDescription = "capture" | "moveWithoutAttack" | "attackWithoutMove";
export type TMoveDescription = TCommonMoveDescription | TCastleMoveDescription | TPawnMoveDescription;
