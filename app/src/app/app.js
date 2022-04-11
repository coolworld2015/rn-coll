'use strict';
console.disableYellowBox = true;

import React, {useState} from 'react';

import Login from './login';
import AppContainer from './appContainer';

const initialState = {
    url: 'https://gredunov.herokuapp.com/',
    //url: 'http://localhost:3000/',
    //url: 'https://jwt-base09.herokuapp.com/',
    isLoggedIn: false,
    item: {},
};

export const AppContext = React.createContext();

const App = () => {
    const [state, setState] = useState(initialState);
    const setContextState = ((state) => {
        return setState(state);
    });

    return (
        <AppContext.Provider value={{state, setContextState}}>
            {state.isLoggedIn
                ? <AppContainer/>
                : <Login/>
            }
        </AppContext.Provider>
    );

};

export default App;
