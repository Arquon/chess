import React, { useState, type FC, useMemo, useSyncExternalStore } from "react";
import { CellComponent } from "../Cell/Cell";
import { EColors } from "@/types/cell/ECellColors";
import ReactBoard from "@/models/reactBoard";
import Cell from "@/models/main/cell";
import Figure from "@/models/main/figure";
import { SelectFigures } from "../SelectFigures/SelectFigures";
import { PortalModal } from "../app/Portal";
import { type TransformationFigure } from "@/models/main/figure";
import { isPawnMoveInfo, isTransformationMoveInfo } from "@/types/moves/PawnMoveInfo";
import { type TMoveInfoWithoutTransformation } from "@/types/MoveInfo";

interface Props {}

export const BoardComponent: FC<Props> = ({}) => {
   const [board] = useState(() => new ReactBoard());
   const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
   const [transformFiguresData, setTransformFiguresData] = useState<TMoveInfoWithoutTransformation | null>(null);

   useSyncExternalStore(
      (fn) => board.addSubscription(fn),
      () => board.getVersion()
   );

   const possibleMoves = useMemo(() => {
      if (!selectedFigure) return [];
      return selectedFigure.possibleMoves;
   }, [selectedFigure]);

   const getCellColor = (rowIndex: number, cellIndex: number): EColors => ((rowIndex + cellIndex) % 2 === 0 ? EColors.black : EColors.white);

   const isPossibleMove = (cell: Cell): TMoveInfoWithoutTransformation | undefined =>
      possibleMoves.find(
         ({ info: { position: possiblePosition } }) => possiblePosition.x === cell.position.x && possiblePosition.y === cell.position.y
      );

   const selectCurrentFigure = (figure: Figure) => {
      if (board.currentTurn !== figure.figureColor) return;
      if (!selectedFigure || figure.figureColor === selectedFigure.figureColor) {
         setSelectedFigure(figure);
      }
   };

   const onCellClickHandler = (cell: Cell) => {
      if (!selectedFigure) {
         if (cell instanceof Figure && cell.figureColor === board.currentTurn) {
            setSelectedFigure(cell);
         }
         return;
      }

      const possibleCellMove = isPossibleMove(cell);

      if (!possibleCellMove) {
         setSelectedFigure(null);
         return;
      }

      const possibleMove: TMoveInfoWithoutTransformation = possibleCellMove;
      const { description: moveInfo } = possibleCellMove.info;

      if (moveInfo === "transformation" || moveInfo === "transformation-capture") {
         setTransformFiguresData(possibleMove);
         return;
      }

      makeMove({ possibleMove });
   };

   interface MakeMoveParams {
      possibleMove: TMoveInfoWithoutTransformation;
      transformation?: TransformationFigure;
   }

   const makeMove = ({ possibleMove, transformation }: MakeMoveParams) => {
      if (!selectedFigure) return;

      if (isPawnMoveInfo(possibleMove) && isTransformationMoveInfo(possibleMove)) {
         if (!transformation) throw new Error("No Transformation Figure");
         board.makeMove({ ...possibleMove, info: { ...possibleMove.info, transformation } });
      } else {
         board.makeMove(possibleMove);
      }

      setSelectedFigure(null);
   };

   const selectTransformationFigure = (figure: TransformationFigure) => {
      if (!transformFiguresData) throw new Error("Transformation figure data is not provided");

      makeMove({ possibleMove: transformFiguresData, transformation: figure });
      setTransformFiguresData(null);
   };

   return (
      <div className="board">
         {board.cells.map((cols) => (
            <div className="row">
               {cols.map((cell) => (
                  <CellComponent
                     cell={cell}
                     cellColor={getCellColor(cell.position.x, cell.position.y)}
                     isSelected={!!isPossibleMove(cell)}
                     onCellClick={onCellClickHandler}
                     selectCurrentFigure={selectCurrentFigure}
                     isSelectedFigure={!!selectedFigure && Cell.checkCellsAreTheSame(selectedFigure, cell)}
                  />
               ))}
            </div>
         ))}
         {transformFiguresData && (
            <PortalModal closeFn={() => setTransformFiguresData(null)}>
               <SelectFigures color={board.currentTurn} makeMove={selectTransformationFigure} />
            </PortalModal>
         )}
      </div>
   );
};
