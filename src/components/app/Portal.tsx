import React, { type FC, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export const PortalModal: FC<PropsWithChildren> = ({ children }) => {
   return <>{createPortal(<div className="app-modal">{children}</div>, document.body)}</>;
};
