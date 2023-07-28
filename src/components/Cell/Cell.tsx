import { EColors } from "@/types/cell/ECellColors";
import { getClassNameFromArray } from "@/utils/functions";
import React, { type FC } from "react";
import { FigureComponent } from "../Figure/Figure";
import type Cell from "@/models/main/cell";
import Figure from "@/models/main/figure";

interface CellProps {
   cell: Cell;
   cellColor: EColors;
   isSelected: boolean;
   isSelectedFigure: boolean;
   onCellClick: (event: React.MouseEvent, cell: Cell) => void;
   onFigureClick: (event: React.MouseEvent, figure: Figure) => void;
}

export const CellComponent: FC<CellProps> = ({ cell, cellColor, isSelected, isSelectedFigure, onFigureClick, onCellClick }) => {
   const classes = ["cell"];
   if (cellColor === EColors.white) {
      classes.push("cell_white");
   } else classes.push("cell_black");

   if (isSelected) classes.push("cell_selected");
   if (isSelectedFigure) classes.push("cell_selected_figured");

   let figureComponent: React.ReactNode = null;

   if (cell instanceof Figure) {
      classes.push("cell_figured");
      figureComponent = <FigureComponent figure={cell} onFigureClick={onFigureClick} />;
   }

   return (
      <div className={getClassNameFromArray(classes)} onClick={(event) => onCellClick(event, cell)}>
         {figureComponent}
      </div>
   );
};
