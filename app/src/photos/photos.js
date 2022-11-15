'use strict';

import React, {useContext, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View,
    Platform,
    PermissionsAndroid,
    Alert
} from 'react-native';

import {AppConfig, AppContext} from '../app/app';
import {useNavigation} from '@react-navigation/core';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';

const Photos = ({navigation}) => {
    const {state, setContextState} = useContext(AppContext);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [records, setRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [serverError, setServerError] = useState(false);
    const [showProgress, setShowProgress] = useState(true);

    useEffect(() => {
        if (Platform.OS === 'android') {
            console.log('Android');
            requestPhotosPermission()
        } else {
            console.log('ios');
            getItems();
        }
    }, []);

    const requestPhotosPermission = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((result) => {
            if (result === PermissionsAndroid.RESULTS.GRANTED) {
                getItems();
                console.log('Photos permission GRANTED');
            } else {
                console.log('Photos permission denied');
            }
        })
            .catch((err) => {
                console.log('error ', error);
            })
    };

    const getItems = () => {
        CameraRoll.getPhotos({
            first: 2000,
            assetType: 'All',
        })
            .then(items => {
                console.log(items.edges);
                setItems(items.edges);
                setFilteredItems(items.edges);
                setRecords(items.edges.length);
                setShowProgress(false);
                setContextState({...state, ...{setShowProgress}});
            })
            .catch((err) => {
                console.log('error ', error);
                setShowProgress(false);
                setServerError(true);
            });
    };

    const refreshData = () => {
        setShowProgress(true);
        setServerError(false);
        setItems([]);
        setRecords(0);
        getItems();
    };

    const onChangeText = (text) => {
        let arr = [].concat(filteredItems);

        let filteredItems1 = arr.filter((el) => el.node.image.filename.toLowerCase().indexOf(text.toLowerCase()) !== -1);
        setItems(filteredItems1);
        setRecords(filteredItems1.length);
        setSearchQuery(text);
    };

    const clearSearchQuery = () => {
        setItems(filteredItems);
        setRecords(filteredItems.length);
        setSearchQuery('');
    };

    let errorCtrl, loader, image;

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

    if (searchQuery.length > 0) {
        image = <Image
            source={require('../../img/cancel.png')}
            style={{
                height: 20,
                width: 20,
                marginTop: 10,
            }}
        />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <TouchableWithoutFeedback>
                        <View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View>
                    <TouchableWithoutFeedback>
                        <View>
                            <Text style={styles.textLarge}>
                                Photos
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View>
                    <TouchableHighlight
                        onPress={() => true}
                        underlayColor='darkblue'>
                        <View>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>

            <View style={styles.iconForm}>
                <View>
                    <TextInput
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onChangeText={onChangeText}
                        style={styles.searchLarge}
                        value={searchQuery}
                        placeholderTextColor='gray'
                        placeholder='Search here'>
                    </TextInput>
                </View>
                <View style={styles.searchSmall}>
                    <TouchableWithoutFeedback
                        onPress={clearSearchQuery}>
                        <View>
                            {image}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>

            {loader}

            {errorCtrl}

            <FlatList
                data={items}
                renderItem={({item}) => (
                    <Item
                        id={item.id}
                        name={item.node.timestamp}
                        image={item.node.image.uri}
                        data={{item}}
                        navigation={navigation}
                    />
                )}
                keyExtractor={item => item.id}
                refreshControl={
                    <RefreshControl
                        enabled={false}
                        refreshing={false}
                        tintColor='transparent'
                        onRefresh={refreshData}
                    />
                }
            />

            <View>
                <TouchableWithoutFeedback>
                    <View>
                        <Text style={styles.countFooter}>
                            Records: {records}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
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
                setServerError(true);
            })
            .finally(() => {
                setShowProgress(false);
            });
    };

    return (
        <TouchableHighlight
            onPress={() => {

                if (item.image.startsWith('ph://')) {
                    let imagePATH = item.image.substring(5,41);
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

                //console.log('Image ',item.image);

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
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 50,
    },
    iconForm: {
        flexDirection: 'row',
        borderColor: 'darkblue',
        borderWidth: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'darkblue',
        borderWidth: 0,
        borderColor: 'whitesmoke',
        marginTop: 50,
    },
    searchLarge: {
        height: 45,
        padding: 5,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 0,
        width: Dimensions.get('window').width * .90,
    },
    searchSmall: {
        height: 45,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'white',
        marginLeft: -5,
        paddingLeft: 5,
        width: Dimensions.get('window').width * .10,
    },
    textSmall: {
        fontSize: 16,
        textAlign: 'center',
        margin: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    textLarge: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        marginTop: 12,
        paddingLeft: 0,
        fontWeight: 'bold',
        color: 'white',
    },
    textInput: {
        height: 45,
        marginTop: 0,
        padding: 5,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: 'lightgray',
        borderRadius: 0,
    },
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
    countFooter: {
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        borderColor: '#D7D7D7',
        backgroundColor: 'darkblue',
        color: 'white',
        fontWeight: 'bold',
    },
    loader: {
        justifyContent: 'center',
        height: 100,
    },
    error: {
        color: 'red',
        paddingTop: 10,
        textAlign: 'center',
    },
    menu: {
        alignItems: 'center',
        margin: 14,
        marginTop: 16,
    },
});

export default Photos;
