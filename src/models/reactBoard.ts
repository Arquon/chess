import { type TMoveInfo } from "@/types/MoveInfo";
import Board from "./main/board";

interface IReactBoard {
   subscriptions: Set<() => void>;
   version: number;
   addSubscription: (fn: () => void) => void;
}

export default class ReactBoard extends Board implements IReactBoard {
   subscriptions = new Set<() => void>();
   version = 0;

   addSubscription(fn: () => void): () => void {
      this.subscriptions.add(fn);

      return () => this.subscriptions.delete(fn);
   }

   getVersion(): number {
      return this.version;
   }

   makeMove(move: TMoveInfo) {
      this.version += 1;
      super.makeMove(move);
      this.subscriptions.forEach((fn) => {
         fn();
      });
   }
}
