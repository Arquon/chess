import { type ICellPosition } from "@/types/cell/TCellNumbers";

export function applyMixins(derivedCtor: any, constructors: any[]): void {
   constructors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
         if (name !== "constructor")
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ?? Object.create(null));
      });
   });
}

export function getClassNameFromArray(arr: string[]): string | undefined {
   return arr.length ? arr.join(" ") : undefined;
}

export const cellPositionToString = (cellPosition: ICellPosition): string => `${cellPosition.x}-${cellPosition.y}`;
