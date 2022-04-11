'use strict';

import React, {useState, useContext, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
} from 'react-native';

import {AppContext} from './app';

const Login = () => {
    const {state, setContextState} = useContext(AppContext);
    const [showProgress, setShowProgress] = useState(false);
    const [badCredentials, setBadCredentials] = useState(false);
    const [name, setName] = useState('1');
    const [pass, setPass] = useState('1');

    useEffect(() => {
        return () => {
            console.log('logged in ');
        }
    }, []);

    let errorCtrl;
    if (badCredentials) {
        errorCtrl = <Text style={styles.error}>
            That username and password combination did not work
        </Text>;
    }

    const onLogin = () => {
        if (name === undefined || name === '' ||
            pass === undefined || pass === '') {
            setBadCredentials(true);
            return;
        }

        setShowProgress(true);
        fetch(state.url + 'api/login', {
            method: 'post',
            body: JSON.stringify({
                name,
                pass,
                description: 'iOS',
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log('SET_TOKEN ', responseData);
                if (responseData.token) {
                    setContextState({...state, ...{token: responseData.token, isLoggedIn: true}});
                    setBadCredentials(false);
                } else {
                    this.setState({
                        badCredentials: true,
                        showProgress: false,
                    });
                }
            })
            .catch(() => {
                setBadCredentials(true);
                setShowProgress(false);
            });
    };

    return (
        <ScrollView style={{backgroundColor: 'whitesmoke'}} keyboardShouldPersistTaps='always'>
            <KeyboardAvoidingView behavior="padding" enabled>
                <View style={styles.container}>

                    <View style={styles.headerContainer}>
                        <Text style={styles.heading}>
                            Gredunov's Collection
                        </Text>
                    </View>

                    <Image style={styles.logo}
                           source={require('../../img/logo.jpg')}
                    />

                    <TextInput
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onChangeText={(text) => {
                            setName(text);
                            setBadCredentials(false);
                        }}
                        style={styles.input}
                        value={name}
                        placeholder='Login'>
                    </TextInput>

                    <TextInput
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onChangeText={(text) => {
                            setPass(text);
                            setBadCredentials(false);
                        }}
                        style={styles.input}
                        value={pass}
                        placeholder='Password'
                        secureTextEntry={true}>
                    </TextInput>

                    <TouchableHighlight
                        onPress={() => onLogin()}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                            Log in
                        </Text>
                    </TouchableHighlight>

                    {errorCtrl}

                    <ActivityIndicator
                        animating={showProgress}
                        size="large"
                        color="darkblue"
                        style={styles.loader}
                    />

                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        padding: 10,
        alignItems: 'center',
        flex: 1,
        marginTop: 50,
    },
    logo: {
        width: 150,
        height: 150,
        paddingTop: 140,
        borderRadius: 20,
        marginBottom: 10,
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: -10,
    },
    heading: {
        fontSize: 30,
        marginTop: 10,
        color: 'navy',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        height: 50,
        backgroundColor: 'darkblue',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 20,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        width: Dimensions.get('window').width * .90,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        color: 'black',
        backgroundColor: 'white',
    },
    loader: {
        marginTop: 40,
    },
    error: {
        color: 'red',
        paddingTop: 10,
        textAlign: 'center',
    },
});

export default Login;
