import React, { type FC } from "react";
import { EColors } from "@/types/cell/ECellColors";

import BlackBishopSVG from "@/assets/images/figures/black-bishop.svg";
import WhiteBishopSVG from "@/assets/images/figures/white-bishop.svg";

interface BishopProps {
   color: EColors;
}

export const BishopComponent: FC<BishopProps> = ({ color }) => {
   switch (color) {
      case EColors.white:
         return <img src={WhiteBishopSVG} />;
      case EColors.black:
         return <img src={BlackBishopSVG} />;
   }
};
