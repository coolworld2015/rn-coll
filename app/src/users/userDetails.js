'use strict';

import React, {useContext, useState} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {AppContext} from '../app/app';

const UserDetails = () => {
    const {state, setContextState} = useContext(AppContext);
    const navigation = useNavigation();
    const [serverError, setServerError] = useState(false);
    const [invalidValue, setInvalidValue] = useState(false);
    const [showProgress, setShowProgress] = useState(false);

    const [name, setName] = useState(state.item.name);
    const [pass, setPass] = useState(state.item.pass);
    const [description, setDescription] = useState(state.item.description);

    const goBack = () => {
        navigation.goBack();
    };

    const updateItem = () => {
        if (name === undefined || name === '' ||
            pass === undefined || pass === '' ||
            description === undefined || description === '') {
            setInvalidValue(true);
            return;
        }

        setShowProgress(true);

        fetch(state.url + 'api/users/update', {
            method: 'post',
            body: JSON.stringify({
                id: state.item.id,
                name,
                pass,
                description,
                authorization: state.token
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then(() => {
                setContextState({...state, ...{refresh: true}});
                navigation.goBack();
            })
            .catch((error) => {
                console.log('error ', error);
                setServerError(true);
            })
            .finally(() => {
                setShowProgress(false);
            });
    };

    const deleteItemDialog = () => {
        Alert.alert(
            'Delete record',
            'Are you sure you want to delete ' + state.item.name + '?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                {
                    text: 'OK', onPress: () => {
                        setShowProgress(true);
                        deleteItem();
                    }
                },
            ]
        );
    };

    const deleteItem = () => {
        fetch(state.url + 'api/users/delete', {
            method: 'post',
            body: JSON.stringify({
                id: state.item.id,
                authorization: state.token
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then(() => {
                setContextState({...state, ...{refresh: true}});
                navigation.goBack();
            })
            .catch((error) => {
                console.log('error ', error);
                setServerError(true);
            })
            .finally(() => {
                setShowProgress(false);
            });
    };

    let errorCtrl, validCtrl, loader;

    if (invalidValue) {
        validCtrl = <Text style={styles.error}>
            Value required - please provide.
        </Text>;
    }

    if (serverError) {
        errorCtrl = <Text style={styles.error}>
            Something went wrong.
        </Text>;
    }

    if (showProgress) {
        loader = <View style={styles.loader}>
            <ActivityIndicator
                size="large"
                color="darkblue"
                animating={true}
            />
        </View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <TouchableHighlight
                        onPress={() => goBack()}
                        underlayColor='darkblue'>
                        <View>
                            <Text style={styles.textSmall}>
                                Back
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View>
                    <TouchableWithoutFeedback>
                        <View>
                            <Text style={styles.textLarge}>
                                {state.item.name}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View>
                    <TouchableHighlight
                        onPress={() => deleteItemDialog()}
                        underlayColor='darkblue'>
                        <View>
                            <Text style={styles.textSmall}>
                                Delete
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>

            <ScrollView>
                <View style={styles.form}>
                    <TextInput
                        style={styles.formInputBold}
                        value={state.item.id.toString()}
                        editable={false}
                        placeholder="ID">
                    </TextInput>

                    <TextInput
                        onChangeText={(text) => {
                            setName(text);
                            setInvalidValue(false)
                        }}
                        style={styles.formInputBold}
                        value={name}
                        placeholder="Name">
                    </TextInput>

                    <TextInput
                        onChangeText={(text) => {
                            setPass(text);
                            setInvalidValue(false)
                        }}
                        style={styles.formInputBold}
                        value={pass}
                        placeholder="Pass">
                    </TextInput>

                    <TextInput
                        onChangeText={(text) => {
                            setDescription(text);
                            setInvalidValue(false)
                        }}
                        style={styles.formInputBold}
                        value={description}
                        placeholder="Description">
                    </TextInput>

                    {loader}

                    {errorCtrl}

                    {validCtrl}

                    <TouchableHighlight
                        onPress={() => updateItem()}
                        style={styles.button}>
                        <View>
                            <Text style={styles.buttonText}>
                                Submit
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'darkblue',
        borderWidth: 0,
        borderColor: 'whitesmoke',
        marginTop: 50,
    },
    textSmall: {
        fontSize: 16,
        textAlign: 'center',
        margin: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    textLarge: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        marginTop: 12,
        marginRight: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    form: {
        flex: 1,
        padding: 10,
        justifyContent: 'flex-start',
        paddingBottom: 130,
        backgroundColor: 'white',
    },
    itemBlock: {
        flexDirection: 'row',
    },
    itemWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTextBold: {
        fontSize: 18,
        textAlign: 'left',
        margin: 5,
        fontWeight: 'bold',
        color: 'black',
    },
    itemText: {
        fontSize: 18,
        textAlign: 'left',
        margin: 5,
        marginLeft: 2,
        color: 'black',
    },
    button: {
        height: 50,
        backgroundColor: 'darkblue',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 20,
    },
    error: {
        color: 'red',
        paddingTop: 10,
        textAlign: 'center',
    },
    img: {
        height: 300,
        width: 270,
        borderRadius: 20,
        margin: 10,
    },
    formInputBold: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        color: 'black',
        fontWeight: 'bold'
    },
});

export default UserDetails;
