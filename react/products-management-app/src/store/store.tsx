// Library
import React, { ReactNode, useReducer, useContext } from 'react';

// Reducer
import { InitialState } from './reducer';

interface ContextProps {
  globalState: InitialState;
  dispatch: ({ type }: { type: string; }) => void;
}

const Store = React.createContext({} as ContextProps);
Store.displayName = 'Store';

const useStore = () => useContext(Store);

interface StoreProviderProps {
  children: ReactNode;
  reducer: any;
  initialState: InitialState;
}

const StoreProvider: React.FC<StoreProviderProps> = ({
  children,
  reducer,
  initialState
}) => {
  const [globalState, dispatch] = useReducer(reducer, initialState) as [InitialState, any];

  return (
    <Store.Provider value={{ globalState, dispatch }}>
      {children}
    </Store.Provider>
  );
};

export { useStore, StoreProvider };
