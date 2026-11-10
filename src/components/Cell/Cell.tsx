import { EColors } from "@/types/cell/ECellColors";
import { getClassNameFromArray } from "@/utils/functions";
import React, { type ReactNode } from "react";
import { FigureComponent } from "../Figure/Figure";
import type Cell from "@/models/main/cell";
import Figure from "@/models/main/figure";

interface CellProps {
   cell: Cell;
   cellColor: EColors;
   isSelected: boolean;
   isSelectedFigure: boolean;
   onCellClick: (cell: Cell) => void;
   selectCurrentFigure: (figure: Figure) => void;
}

export const CellComponent = ({ cell, cellColor, isSelected, isSelectedFigure, selectCurrentFigure, onCellClick }: CellProps) => {
   const classes = ["cell"];
   if (cellColor === EColors.white) {
      classes.push("cell_white");
   } else classes.push("cell_black");

   if (isSelected) classes.push("cell_selected");
   if (isSelectedFigure) classes.push("cell_selected_figured");

   let figureComponent: ReactNode = null;

   if (cell instanceof Figure) {
      classes.push("cell_figured");
      figureComponent = <FigureComponent figure={cell} />;
   }

   const onClickHandler = () => {
      onCellClick(cell);
   };

   return (
      <div className={getClassNameFromArray(classes)} onClick={onClickHandler}>
         {figureComponent}
      </div>
   );
};
