'use strict';

import React, {useReducer} from 'react';

import Login from './login';
import AppContainer from './appContainer';

const initialState = {
    //url: 'https://gredunov.herokuapp.com/',
    url: 'http://localhost:3000/',
    isLoggedIn: false,
    item: {},
};

export const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.data,
            };
        case 'SET_IS_LOGGED_IN':
            return {
                ...state,
                isLoggedIn: true,
            };
        case 'SET_IS_LOGGED_OUT':
            return {
                ...state,
                isLoggedIn: false,
            };
            case 'SET_ITEM':
            return {
                ...state,
                item: action.data,
            };
        default:
            return state;
    }
};

export const AppConfig = React.createContext();

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppConfig.Provider value={{state, dispatch}}>
            {state.isLoggedIn
                ? <AppContainer/>
                : <Login/>
            }
        </AppConfig.Provider>
    );

};

export default App;
