import React, { useState, type FC, useEffect, useMemo } from "react";
import { CellComponent } from "../Cell/Cell";
import { EColors } from "@/types/cell/ECellColors";
import { type IMoveInfo } from "@/types/IMove";
import ReactBoard from "@/models/reactBoard";
import Cell from "@/models/main/cell";
import type Figure from "@/models/main/figure";

interface Props {}

export const BoardComponent: FC<Props> = ({}) => {
   const [board, setBoard] = useState(() => new ReactBoard());
   const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);

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
   const isPossibleMove = (cell: Cell): IMoveInfo | undefined =>
      possibleMoves.find((selectedField) => selectedField.position.x === cell.position.x && selectedField.position.y === cell.position.y);

   const onCellClickHandler = (event: React.MouseEvent, cell: Cell): void => {
      if (!selectedFigure || event.defaultPrevented) return;
      const possibleMove = isPossibleMove(cell);
      if (!possibleMove) {
         setSelectedFigure(null);
         return;
      }
      board.makeMove({
         previousPosition: selectedFigure.position,
         figure: selectedFigure,
         nextPosition: possibleMove.position,
         info: possibleMove.info,
      });
      setSelectedFigure(null);
   };
   const onFigureClickHandler = (event: React.MouseEvent, figure: Figure): void => {
      // console.log({
      //    possibleFigureAttacks: figure.possibleAttacks,
      //    attacks: figure.figureColor === EColors.white ? board.whiteAttackedFields : board.blackAttackedFields,
      // });

      if (board.currentTurn !== figure.figureColor) return;
      if (!selectedFigure || figure.figureColor === selectedFigure.figureColor) {
         event.preventDefault();
         setSelectedFigure(figure);
      }
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
      </div>
   );
};
