import React, { type FC } from "react";
import { EColors } from "@/types/cell/ECellColors";

import BlackRockSVG from "@/assets/images/figures/black-rock.svg";
import WhiteRockSVG from "@/assets/images/figures/white-rock.svg";

interface RockProps {
   color: EColors;
}

export const RockComponent: FC<RockProps> = ({ color }) => {
   switch (color) {
      case EColors.white:
         return <img src={WhiteRockSVG} />;
      case EColors.black:
         return <img src={BlackRockSVG} />;
   }
};
