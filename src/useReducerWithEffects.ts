/* eslint-disable no-console */
/**
 * Copied from https://gist.github.com/sophiebits/145c47544430c82abd617c9cdebefee8
 */

import { useCallback, useEffect, useReducer, useRef, Reducer } from "react";
type effect = () => void;
let effectCapture: effect[] | null = null;
/**
 * Reducer hook which can emit effects
 */
export function useReducerWithEffects<State, Action>(
  reducer: Reducer<State, Action>,
  initialArg: State,
  enableLogging?: boolean
): [State, (action: Action) => void] {
  const updateCounter = useRef(0);
  const wrappedReducer = useCallback(
    function (oldWrappedState, action) {
      if (enableLogging) {
        console.log(action.action.type, action.action.payload);
        console.log("Current state: ", oldWrappedState.state);
      }
      effectCapture = [];
      try {
        const newState = reducer(oldWrappedState.state, action.action);
        let lastAppliedContiguousUpdate =
          oldWrappedState.lastAppliedContiguousUpdate;
        const effects = oldWrappedState.effects || [];
        if (lastAppliedContiguousUpdate + 1 === action.updateCount) {
          lastAppliedContiguousUpdate++;
          effects.push(...effectCapture);
        }
        if (enableLogging) {
          console.log("Next state: ", newState);
        }
        return {
          state: newState,
          lastAppliedContiguousUpdate,
          effects,
        };
      } finally {
        effectCapture = null;
      }
    },
    [reducer]
  );
  const [wrappedState, rawDispatch] = useReducer(
    wrappedReducer,
    undefined,
    function () {
      const initialState = initialArg;
      return {
        state: initialState,
        lastAppliedContiguousUpdate: 0,
        effects: null,
      };
    }
  );
  const dispatch = useCallback(function dispatch_(action) {
    updateCounter.current++;
    rawDispatch({ updateCount: updateCounter.current, action });
  }, []);
  useEffect(function () {
    if (wrappedState.effects) {
      wrappedState.effects.forEach(function (eff: effect) {
        eff();
      });
    }
    wrappedState.effects = null;
  });
  return [wrappedState.state, dispatch];
}

export function emitEffect(fn: () => void) {
  if (!effectCapture) {
    throw new Error(
      "emitEffect can only be called from a useReducerWithEmitEffect reducer"
    );
  }
  effectCapture.push(fn);
}
