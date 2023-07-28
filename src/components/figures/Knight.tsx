import React, { type FC } from "react";
import { EColors } from "@/types/cell/ECellColors";

import BlackKnightSVG from "@/assets/images/figures/black-knight.svg";
import WhiteKnightSVG from "@/assets/images/figures/white-knight.svg";

interface KnightProps {
   color: EColors;
}

export const KnightComponent: FC<KnightProps> = ({ color }) => {
   switch (color) {
      case EColors.white:
         return <img src={WhiteKnightSVG} />;
      case EColors.black:
         return <img src={BlackKnightSVG} />;
   }
};
