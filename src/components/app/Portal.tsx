import React, { type ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalModalProps {
   closeFn: () => void;
   children: ReactNode;
}

export const PortalModal = ({ children, closeFn }: PortalModalProps) => {
   return createPortal(
      <div className="app-modal" onClick={closeFn}>
         {children}
      </div>,
      document.body
   );
};
