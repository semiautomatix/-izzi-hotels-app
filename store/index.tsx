// store.js
import React, { createContext, useReducer } from 'react';

interface IState {  
  countries: string[]
  services: any[]
};

const initialState: IState = {  
  countries: [],
  services: []
};

const store = createContext(initialState);
const { Provider } = store;

enum ActionType {
  SetNationalities = 'setNationalities',
  SetServices = 'setServices'
}

interface IAction {
  type: ActionType,
  payload: any
}

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<any, IAction>>((state: any, action: IAction) => {
    switch(action.type) {
      case ActionType.SetNationalities:
        return {
          ...state,
          nationalities: action.payload
        };   
      case ActionType.SetServices:
        return {
          ...state,
          services: action.payload
        };               
      default:
        throw new Error();
    };
  }, initialState);

  // @ts-ignore
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }