'use strict';

import React, {useContext, useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/core';

import {Image, Platform} from 'react-native';

import {AppContext} from './app';

import Items from '../items/items';
import ItemDetails from '../items/itemDetails';

import Phones from '../phones/phones';
import PhoneDetails from '../phones/phoneDetails';

import Photos from '../photos/photos';

import Users from '../users/users';
import UserAdd from '../users/userAdd';
import UserDetails from '../users/userDetails';

import Audit from '../audit/audit';
import AuditDetails from '../audit/auditDetails';

const LogOut = () => {
    const navigation = useNavigation();
    const {state, setContextState} = useContext(AppContext);

    useEffect(() => {
        const didFocusListener = navigation.addListener(
            'focus',
            () => {
                console.log('Focused on Quit');
                setContextState({...state, ...{isLoggedIn: false, token: null}});
            },
        );
    }, []);

    return null;
};

const ItemsStack = createStackNavigator();

const ItemsStackScreen = () => {
    return (
        <ItemsStack.Navigator headerMode={'none'}>
            <ItemsStack.Screen name="Items" component={Items} options={{title: ''}}/>
            <ItemsStack.Screen name="Details" component={ItemDetails} options={{title: '', headerLeft: null}}/>
        </ItemsStack.Navigator>
    );
};

const SearchStack = createStackNavigator();

const SearchStackScreen = () => {
    return (
        <SearchStack.Navigator headerMode={'none'}>
            <SearchStack.Screen name="Items" component={Phones} options={{title: ''}}/>
            <SearchStack.Screen name="Details" component={PhoneDetails} options={{title: '', headerLeft: null}}/>
        </SearchStack.Navigator>
    );
};

const UsersStack = createStackNavigator();

const UsersStackScreen = () => {
    return (
        <UsersStack.Navigator headerMode={'none'}>
            <UsersStack.Screen name="Users" component={Users} options={{title: ''}}/>
            <UsersStack.Screen name="Add" component={UserAdd} options={{title: '', headerLeft: null}}/>
            <UsersStack.Screen name="Details" component={UserDetails} options={{title: '', headerLeft: null}}/>
        </UsersStack.Navigator>
    );
};

const AuditStack = createStackNavigator();

const AuditStackScreen = () => {
    return (
        <AuditStack.Navigator headerMode={'none'}>
            <AuditStack.Screen name="Audit" component={Audit} options={{title: ''}}/>
            <AuditStack.Screen name="Details" component={AuditDetails} options={{title: '', headerLeft: null}}/>
        </AuditStack.Navigator>
    );
};

const PhotosStack = createStackNavigator();

const PhotosStackScreen = () => {
    return (
        <PhotosStack.Navigator headerMode={'none'}>
            <PhotosStack.Screen name="Photos" component={Photos} options={{title: ''}}/>
        </PhotosStack.Navigator>
    );
};

const Tab = Platform.select({
    ios: () => createBottomTabNavigator(),
    //android: () => createMaterialTopTabNavigator(),
})();

const AppContainer = () => {
    const tabBarOptions = {
        style: {
            backgroundColor: 'white',
        },
        labelStyle: {
            color: 'darkblue',
            fontWeight: 'bold',
        },
        upperCaseLabel: false,
        indicatorStyle: {backgroundColor: 'darkblue'},
    };

    const name = 'Users';
    const MyTheme = {
        dark: false,
        colors: {
            background: 'white',
            card: 'rgb(255, 255, 255)',
            text: 'rgb(28, 28, 30)',
            border: 'rgb(199, 199, 204)',
        },
    };

    return (
        <NavigationContainer theme={MyTheme}>
            <Tab.Navigator
                style={{backgroundColor: 'white'}}
                tabBarPosition={'top'}
                tabBarOptions={tabBarOptions}
                sceneContainerStyle={{marginTop: -49, backgroundColor: 'white'}}
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;

                        if (route.name === 'Items') {
                            iconName = <Image
                                source={require('../../img/images.png')}
                                style={{
                                    height: 20,
                                    width: 20,
                                    margin: 0,
                                }}
                            />;
                        }
                        if (route.name === 'Items' && focused) {
                            iconName = <Image
                                source={require('../../img/images.png')}
                                style={{
                                    height: 25,
                                    width: 25,
                                    margin: 0,
                                }}
                            />;
                        }

                        if (route.name === 'Phones') {
                            iconName = <Image
                                source={require('../../img/search.png')}
                                style={{
                                    height: 20,
                                    width: 20,
                                    margin: 0,
                                }}
                            />;
                        }
                        if (route.name === 'Phones' && focused) {
                            iconName = <Image
                                source={require('../../img/search.png')}
                                style={{
                                    height: 25,
                                    width: 25,
                                    margin: 0,
                                }}
                            />;
                        }

                        if (route.name === 'Photos') {
                            iconName = <Image
                                source={require('../../img/images.png')}
                                style={{
                                    height: 20,
                                    width: 20,
                                    margin: 0,
                                }}
                            />;
                        }
                        if (route.name === 'Photos' && focused) {
                            iconName = <Image
                                source={require('../../img/images.png')}
                                style={{
                                    height: 25,
                                    width: 25,
                                    margin: 0,
                                }}
                            />;
                        }

                        if (route.name === 'Users') {
                            iconName = <Image
                                source={require('../../img/users.png')}
                                style={{
                                    height: 15,
                                    width: 15,
                                    margin: 0,
                                }}
                            />;
                        }
                        if (route.name === 'Users' && focused) {
                            iconName = <Image
                                source={require('../../img/users.png')}
                                style={{
                                    height: 25,
                                    width: 25,
                                    margin: 0,
                                }}
                            />;
                        }

                        if (route.name === 'Audit') {
                            iconName = <Image
                                source={require('../../img/clock.png')}
                                style={{
                                    height: 20,
                                    width: 20,
                                    margin: 0,
                                }}
                            />;
                        }
                        if (route.name === 'Audit' && focused) {
                            iconName = <Image
                                source={require('../../img/clock.png')}
                                style={{
                                    height: 25,
                                    width: 25,
                                    margin: 0,
                                }}
                            />;
                        }
                        if (route.name === 'Quit') {
                            iconName = <Image
                                source={require('../../img/log-out.png')}
                                style={{
                                    height: 20,
                                    width: 20,
                                    margin: 0,
                                }}
                            />;
                        }

                        return iconName;
                    },
                })}
            >
                <Tab.Screen name="Items" component={ItemsStackScreen}/>
                <Tab.Screen name="Phones" component={SearchStackScreen}/>
                <Tab.Screen name="Audit" component={AuditStackScreen}/>
                <Tab.Screen name="Photos" component={PhotosStackScreen}/>
                <Tab.Screen name={name} component={UsersStackScreen}/>

                <Tab.Screen name="Quit" component={LogOut}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppContainer;
