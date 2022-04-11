'use strict';

import React, {useContext, useState} from 'react';
import {
    StyleSheet,
    Text,
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
    const [showProgress, setShowProgress] = useState(false);

    const goBack = () => {
        navigation.goBack();
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
                setShowProgress(false);
                setContextState({...state,...{refresh: true}});
                navigation.goBack();
            })
            .catch((error) => {
                console.log('error ', error);
                setShowProgress(false);
                setServerError(true);
                navigation.goBack();
            });
    };

    let errorCtrl, loader;

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

                    <View style={styles.itemBlock}>
                        <Text style={styles.itemTextBold}>
                            ID:
                        </Text>
                        <View style={styles.itemWrap}>
                            <Text style={styles.itemText}>
                                {state.item.id}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.itemBlock}>
                        <Text style={styles.itemTextBold}>
                            Name:
                        </Text>
                        <View style={styles.itemWrap}>
                            <Text style={styles.itemText}>
                                {state.item.name}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.itemBlock}>
                        <Text style={styles.itemTextBold}>
                            Pass:
                        </Text>
                        <View style={styles.itemWrap}>
                            <Text style={styles.itemText}>
                                {state.item.pass}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.itemBlock}>
                        <Text style={styles.itemTextBold}>
                            Description:
                        </Text>
                        <View style={styles.itemWrap}>
                            <Text style={styles.itemText}>
                                {state.item.description}
                            </Text>
                        </View>
                    </View>

                    {loader}

                    {errorCtrl}

                    <TouchableHighlight
                        onPress={() => goBack()}
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
});

export default UserDetails;


/*


'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ScrollView,
    ActivityIndicator,
    TextInput, TouchableWithoutFeedback, Alert
} from 'react-native';

class UserDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: appConfig.users.item.id,
            name: appConfig.users.item.name,
            pass: appConfig.users.item.pass,
            description: appConfig.users.item.description,
            showProgress: false
        };
    }

    updateItem() {
        if (this.state.name === undefined || this.state.pass === '' ||
            this.state.description === undefined || this.state.description === '') {
            this.setState({
                invalidValue: true
            });
            return;
        }

        this.setState({
            showProgress: true
        });

        fetch(appConfig.url + 'api/users/update', {
            method: 'post',
            body: JSON.stringify({
                id: this.state.id,
                name: this.state.name,
                pass: this.state.pass,
                description: this.state.description,
                authorization: appConfig.access_token
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.pass) {
                    this.props.navigation.navigate('Users', { refresh: true})

                } else {
                    this.setState({
                        badCredentials: true
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    serverError: true
                });
            })
            .finally(() => {
                this.setState({
                    showProgress: false
                });
            });
    }

    deleteItemDialog() {
        Alert.alert(
            'Delete record',
            'Are you sure you want to delete ' + this.state.name + '?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                {
                    text: 'OK', onPress: () => {
                        this.deleteItem();
                    }
                },
            ]
        );
    }

    deleteItem() {
        this.setState({
            showProgress: true,
            bugANDROID: ' '
        });

        fetch(appConfig.url + 'api/users/delete', {
            method: 'post',
            body: JSON.stringify({
                id: this.state.id,
                authorization: appConfig.access_token
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.text) {
                    this.props.navigation.navigate('Users', { refresh: true})
                } else {
                    this.setState({
                        badCredentials: true
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    serverError: true
                });
            })
            .finally(() => {
                this.setState({
                    showProgress: false
                });
            });

    }

    goBack() {
        this.props.navigation.goBack();
    }

    render() {
        let errorCtrl, validCtrl;

        if (this.state.serverError) {
            errorCtrl = <Text style={styles.error}>
                Something went wrong.
            </Text>;
        }

        if (this.state.invalidValue) {
            validCtrl = <Text style={styles.error}>
                Value required - please provide.
            </Text>;
        }

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <TouchableHighlight
                            onPress={()=> this.goBack()}
                            underlayColor='darkblue'
                        >
                            <View>
                                <Text style={styles.textSmall}>
                                    Back
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View>
                        <TouchableWithoutFeedback underlayColor='#ddd'>
                            <View>
                                <Text style={styles.textLarge}>
                                    {this.state.name}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View>
                        <TouchableHighlight
                            onPress={() => this.deleteItemDialog()}
                            underlayColor='darkblue'
                        >
                            <View>
                                <Text style={styles.textSmall}>
                                    Delete
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>

                <ScrollView keyboardShouldPersistTaps='always'>
                    <View style={{
                        flex: 1,
                        padding: 10,
                        justifyContent: 'flex-start'
                    }}>

                        <TextInput
                            onChangeText={(text) => this.setState({
                                name: text,
                                invalidValue: false
                            })}
                            style={styles.formInputBold}
                            value={this.state.name}
                            placeholder="Login">
                        </TextInput>

                        <TextInput
                            onChangeText={(text) => this.setState({
                                pass: text,
                                invalidValue: false
                            })}
                            style={styles.loginInput}
                            value={this.state.pass}
                            placeholder="Password">
                        </TextInput>

                        <TextInput
                            multiline={true}
                            onChangeText={(text) => this.setState({
                                description: text,
                                invalidValue: false
                            })}
                            style={styles.formInputArea}
                            value={this.state.description}
                            placeholder="Description">
                        </TextInput>

                        {validCtrl}

                        <TouchableHighlight
                            onPress={() => this.updateItem()}
                            style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableHighlight>

                        {errorCtrl}

                        <ActivityIndicator
                            animating={this.state.showProgress}
                            size="large"
                            style={styles.loader}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        //backgroundColor: '#48BBEC',
        backgroundColor: 'darkblue',
        borderWidth: 0,
        borderColor: 'whitesmoke'
    },
    textSmall: {
        fontSize: 16,
        textAlign: 'center',
        margin: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    textLarge: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        marginTop: 12,
        marginRight: 20,
        fontWeight: 'bold',
        color: 'white'
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
    loginInput: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        color: 'black'
    },
    formInputArea: {
        height: 100,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        color: 'black'
    },
    button: {
        height: 50,
        backgroundColor: 'darkblue',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    loader: {
        marginTop: 20
    },
    error: {
        color: 'red',
        paddingTop: 10,
        textAlign: 'center'
    }
});

export default UserDetails;
*/
