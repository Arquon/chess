import React, { type FC } from "react";
import { EColors } from "@/types/cell/ECellColors";

import BlackQueenSVG from "@/assets/images/figures/black-queen.svg";
import WhiteQueenSVG from "@/assets/images/figures/white-queen.svg";

interface QueenProps {
   color: EColors;
}

export const QueenComponent: FC<QueenProps> = ({ color }) => {
   switch (color) {
      case EColors.white:
         return <img src={WhiteQueenSVG} />;
      case EColors.black:
         return <img src={BlackQueenSVG} />;
   }
};
