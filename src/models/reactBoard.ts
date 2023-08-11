import { type TMove } from "@/types/Move";
import Board from "./main/board";

interface IReactBoard {
   subscriptions: Array<() => void>;
   addSubscription: (fn: () => void) => void;
}

export default class ReactBoard extends Board implements IReactBoard {
   subscriptions: Array<() => void> = [];

   addSubscription(fn: () => void): void {
      this.subscriptions.push(fn);
   }

   makeMove(move: TMove): void {
      super.makeMove(move);
      this.subscriptions.forEach((fn) => {
         fn();
      });
   }
}
