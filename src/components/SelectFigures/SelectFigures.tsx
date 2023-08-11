import { EFigures, type TransformationFigure } from "@/models/main/figure";
import { type EColors } from "@/types/cell/ECellColors";
import React, { type FC } from "react";
import { BishopComponent } from "../figures/Bishop";
import { KnightComponent } from "../figures/Knight";
import { QueenComponent } from "../figures/Queen";
import { RockComponent } from "../figures/Rock";

interface SelectFiguresProps {
   color: EColors;
   makeMove: (figure: TransformationFigure) => void;
}

export const SelectFigures: FC<SelectFiguresProps> = ({ color, makeMove }) => {
   return (
      <div className="figures-row">
         <div onClick={() => makeMove(EFigures.knight)}>
            <KnightComponent color={color} />
         </div>
         <div onClick={() => makeMove(EFigures.bishop)}>
            <BishopComponent color={color} />
         </div>
         <div onClick={() => makeMove(EFigures.rock)}>
            <RockComponent color={color} />
         </div>
         <div onClick={() => makeMove(EFigures.queen)}>
            <QueenComponent color={color} />
         </div>
      </div>
   );
};
