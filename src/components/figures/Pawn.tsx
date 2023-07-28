import React, { type FC } from "react";
import { EColors } from "@/types/cell/ECellColors";

import BlackPawnSVG from "@/assets/images/figures/black-pawn.svg";
import WhitePawnSVG from "@/assets/images/figures/white-pawn.svg";

interface PawnProps {
   color: EColors;
}

export const PawnComponent: FC<PawnProps> = ({ color }) => {
   switch (color) {
      case EColors.white:
         return <img src={WhitePawnSVG} />;
      case EColors.black:
         return <img src={BlackPawnSVG} />;
   }
};
