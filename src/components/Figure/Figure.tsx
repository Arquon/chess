import React, { type FC } from "react";
import { BishopComponent } from "../figures/Bishop";
import { KingComponent } from "../figures/King";
import { KnightComponent } from "../figures/Knight";
import { PawnComponent } from "../figures/Pawn";
import { QueenComponent } from "../figures/Queen";
import { RockComponent } from "../figures/Rock";
import Pawn from "@/models/pieces/pawn";
import type Figure from "@/models/main/figure";
import Bishop from "@/models/pieces/bishop";
import King from "@/models/pieces/king";
import Knight from "@/models/pieces/knight";
import Queen from "@/models/pieces/queen";
import Rock from "@/models/pieces/rock";

interface FigureProps {
   figure: Figure;
   onFigureClick: (event: React.MouseEvent, figure: Figure) => void;
}

export const FigureComponent: FC<FigureProps> = ({ figure, onFigureClick }) => {
   let Component: React.ReactNode = null;

   if (figure instanceof Pawn) {
      Component = <PawnComponent color={figure.figureColor} />;
   }
   if (figure instanceof Knight) {
      Component = <KnightComponent color={figure.figureColor} />;
   }
   if (figure instanceof Bishop) {
      Component = <BishopComponent color={figure.figureColor} />;
   }
   if (figure instanceof Rock) {
      Component = <RockComponent color={figure.figureColor} />;
   }
   if (figure instanceof Queen) {
      Component = <QueenComponent color={figure.figureColor} />;
   }
   if (figure instanceof King) {
      Component = <KingComponent color={figure.figureColor} />;
   }

   const onFigureClickHandler = (event: React.MouseEvent): void => {
      onFigureClick(event, figure);
   };

   return <div onClick={onFigureClickHandler}>{Component}</div>;
};
