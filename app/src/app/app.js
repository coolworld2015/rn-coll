'use strict';
import {AsyncStorage} from "react-native";

console.disableYellowBox = true;

import React, {useState, useEffect} from 'react';

import Login from './login';
import AppContainer from './appContainer';

const initialState = {
    url: 'https://gredunov.herokuapp.com/',
    //url: 'http://localhost:3000/',
    isLoggedIn: false,
    item: {},
};

export const AppContext = React.createContext();

const App = () => {
    const [state, setState] = useState(initialState);
    const setContextState = ((state) => {
        return setState(state);
    });

    useEffect(() => {
        AsyncStorage.getItem('rn-coll.favorites')
            .then(req => JSON.parse(req))
            .then(data => {
                console.log('rn-coll.favorites - ', data);
                if (!data) {
                    AsyncStorage.setItem('rn-coll.favorites', JSON.stringify(''),)
                        .then(() => {
                                console.log('SET rn-coll.favorites')
                            }
                        )
                }
            })
            .catch(error => console.log(error))
    }, []);

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
