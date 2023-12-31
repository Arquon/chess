import { type TMoveInfo } from "@/types/MoveInfo";
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

   makeMove(move: TMoveInfo): void {
      super.makeMove(move);
      this.subscriptions.forEach((fn) => {
         fn();
      });
   }
}
