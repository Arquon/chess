import React, { type FC } from "react";
import { EColors } from "@/types/cell/ECellColors";

import BlackKingSVG from "@/assets/images/figures/black-king.svg";
import WhiteKingSVG from "@/assets/images/figures/white-king.svg";

interface KingProps {
   color: EColors;
}

export const KingComponent: FC<KingProps> = ({ color }) => {
   switch (color) {
      case EColors.white:
         return <img src={WhiteKingSVG} />;
      case EColors.black:
         return <img src={BlackKingSVG} />;
   }
};
