import React, {
    createContext,
    useContext,
    useReducer,
} from 'react';

import {
    Aggregator,
    Category,
    UserType,
} from './types';

interface Aggregated {
    [k: string]: Aggregator;
}

interface GlobalContextType {
    state: {
        user?: UserType | undefined;
        auth?: UserType | undefined;
        categories?: Category[] | undefined;
        aggregated: Aggregated;
    }
    dispatch: React.Dispatch<any>,
}

export const GlobalContext = createContext<GlobalContextType>({
    state: {
        user: undefined,
        auth: undefined,
        aggregated: {},
    },
    dispatch: () => {},
});

interface ContextProps {
    reducer: any;
    initialState: any;
    children: any;
}

export const StateProvider = ({ reducer, initialState, children }: ContextProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };

    return (
        <GlobalContext.Provider value={value as GlobalContextType}>
            {children}
        </GlobalContext.Provider>
    );
};

export const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.user };
        case 'SET_AUTH':
            return { ...state, auth: action.auth };
        case 'SET_CATEGORIES':
            return { ...state, categories: action.categories };
        case 'SET_AGGREGATED':
            return { ...state, aggregated: action.aggregated };

        default:
            return state;
    }
};

export const useStateValue = () => useContext(GlobalContext);
