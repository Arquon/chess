import React, { useState, type FC, useEffect, useMemo, useRef } from "react";
import { CellComponent } from "../Cell/Cell";
import { EColors } from "@/types/cell/ECellColors";
import ReactBoard from "@/models/reactBoard";
import Cell from "@/models/main/cell";
import type Figure from "@/models/main/figure";
import { SelectFigures } from "../SelectFigures/SelectFigures";
import { PortalModal } from "../app/Portal";
import { type TransformationFigure } from "@/models/main/figure";
import { isPawnMoveInfo, isTransformationMoveInfo } from "@/types/moves/PawnMoveInfo";
import { type TMoveInfoWithoutTransformation } from "@/types/MoveInfo";

interface Props {}

export const BoardComponent: FC<Props> = ({}) => {
   const [board, setBoard] = useState(() => new ReactBoard());
   const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
   const [isTransformFiguresShow, setIsTransformFiguresShow] = useState(false);

   const possibleMove = useRef<TMoveInfoWithoutTransformation | null>(null);

   useEffect(() => {
      board.addSubscription(() => {
         setBoard(new ReactBoard(board));
      });
   }, [board]);

   const possibleMoves = useMemo(() => {
      if (!selectedFigure) return [];
      return selectedFigure.possibleMoves;
   }, [selectedFigure]);

   const getCellColor = (rowIndex: number, cellIndex: number): EColors => ((rowIndex + cellIndex) % 2 === 0 ? EColors.black : EColors.white);

   const isPossibleMove = (cell: Cell): TMoveInfoWithoutTransformation | undefined =>
      possibleMoves.find(
         ({ info: { position: possiblePosition } }) => possiblePosition.x === cell.position.x && possiblePosition.y === cell.position.y
      );

   const onCellClickHandler = (event: React.MouseEvent, cell: Cell): void => {
      if (event.defaultPrevented) return;
      const possibleCellMove = isPossibleMove(cell);

      if (!possibleCellMove) {
         setSelectedFigure(null);
         possibleMove.current = null;
         return;
      }

      possibleMove.current = possibleCellMove;
      const { description: moveInfo } = possibleCellMove.info;

      if (moveInfo === "transformation" || moveInfo === "transformation-capture") {
         setIsTransformFiguresShow(true);
         return;
      }

      makeMove();
   };

   const makeMove = (transformation?: TransformationFigure): void => {
      if (!selectedFigure || !possibleMove.current) return;

      const { current: move } = possibleMove;

      if (isPawnMoveInfo(move) && isTransformationMoveInfo(move)) {
         if (!transformation) throw "No Transformation Figure";
         board.makeMove({ ...move, info: { ...move.info, transformation } });
      } else {
         board.makeMove(move);
      }

      possibleMove.current = null;

      setSelectedFigure(null);
   };

   const onFigureClickHandler = (event: React.MouseEvent, figure: Figure): void => {
      if (board.currentTurn !== figure.figureColor) return;
      if (!selectedFigure || figure.figureColor === selectedFigure.figureColor) {
         event.preventDefault();
         setSelectedFigure(figure);
      }
   };

   const selectTransformationFigure = (figure: TransformationFigure): void => {
      makeMove(figure);
      setIsTransformFiguresShow(false);
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
                     onFigureClick={onFigureClickHandler}
                     isSelectedFigure={!!selectedFigure && Cell.checkCellsAreTheSame(selectedFigure, cell)}
                  />
               ))}
            </div>
         ))}
         {isTransformFiguresShow && (
            <PortalModal>
               <SelectFigures color={board.currentTurn} makeMove={selectTransformationFigure} />
            </PortalModal>
         )}
      </div>
   );
};
