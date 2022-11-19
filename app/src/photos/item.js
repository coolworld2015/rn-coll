'use strict';

import React, {useContext} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image, Alert, Dimensions
} from 'react-native';

import {AppContext} from "../app/app";
import {useNavigation} from '@react-navigation/core';
import RNFS from 'react-native-fs';

const Item = (item) => {
    const {state, setContextState} = useContext(AppContext);
    const navigation = useNavigation();

    const addItemDialog = (pic, name) => {
        Alert.alert(
            'Add pictures',
            'Are you sure you want to add ' + name + '?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel')},
                {
                    text: 'OK', onPress: () => {
                        state.setShowProgress(true);
                        addItem(pic);
                    }
                },
            ]
        );
    };

    const addItem = (pic) => {
        fetch(state.url + 'api/items/add', {
            method: 'post',
            body: JSON.stringify({
                id: (+new Date).toString(),
                name: 'test from IOS',
                pic,
                category: 'test',
                group: 'test',
                description: 'test',
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
                navigation.navigate('Items');
            })
            .catch((error) => {
                console.log('error ', error);
                state.setServerError(true);
            })
            .finally(() => {
                state.setShowProgress(false);
            });
    };

    const timeConverter = (UNIX_timestamp) => {
        let a = new Date(UNIX_timestamp * 1000);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        let hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
        let min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
        let sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
        return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    };

    return (
        <TouchableHighlight
            onPress={() => {

                if (item.image.startsWith('ph://')) {
                    let imagePATH = item.image.substring(5, 41);
                    let photoPATH = `assets-library://asset/asset.JPG?id=${imagePATH}&ext=JPG`;

                    const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.jpg`;

                    RNFS.copyAssetsFileIOS(photoPATH, dest, 500, 500, 1.0, 1.0, 'contain')
                        .then(data => {
                            RNFS.readFile(data, 'base64')
                                .then(base64 => {
                                    //console.log('data:image/png;base64,', base64);
                                    const pic = 'data:image/png;base64,' + base64;
                                    const name = timeConverter(item.name);
                                    addItemDialog(pic, name)
                                });
                        });
                }
            }}
            underlayColor='#ddd'>
            <View style={styles.row}>
                <Text style={styles.rowText}>
                    {timeConverter(item.name)}
                </Text>
                <Image
                    style={{
                        width: 300,
                        height: 200,
                    }}
                    source={{uri: item.image}}
                />
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    row: {
        flex: 1,
        //flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderColor: '#D7D7D7',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
    },
    rowText: {
        backgroundColor: '#fff',
        color: 'black',
        fontWeight: 'bold',
    },
});

export default Item;