'use strict';

import React, {useContext, useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ActivityIndicator,
    TextInput,
    Image,
    Dimensions, FlatList, RefreshControl,
} from 'react-native';

import {AppContext} from '../app/app';
import Item from './item';

const Items = ({navigation}) => {
    const {state} = useContext(AppContext);

    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [records, setRecords] = useState(0);
    const [positionY, setPositionY] = useState(1000);
    const [searchQuery, setSearchQuery] = useState('');
    const [serverError, setServerError] = useState(false);
    const [showProgress, setShowProgress] = useState(true);

    useEffect(() => {
        getItems();
    }, []);

    useEffect(() => {
        if (state.refresh) {
            setShowProgress(true);
            getItems();
        }
    }, [state]);

    const getItems = () => {
        setShowProgress(true);
        setServerError(false);

        fetch(state.url + 'api/pic/get', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': state.token,
            },
        })
            .then((response) => response.json())
            .then(items => {
                setItems(items.sort(sort));
                setFilteredItems(items.slice(0, 20));
                setRecords(items.length);
                setShowProgress(false);
            })
            .catch((error) => {
                console.log('error ', error);
                setShowProgress(false);
                setServerError(true);
            });
    };

    const getChunk = () => {
        console.log('SEND');
        fetch(state.url + 'api/items/chunk/' + records, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': state.token,
            },
        })
            .then((response) => response.json())
            .then(data => {
                setItems(items.concat(data));
                setFilteredItems(items.concat(data));
                setRecords(items.length + 20);
                setShowProgress(false);
                console.log('UPDATE')
            })
            .catch((error) => {
                console.log('error ', error);
                setShowProgress(false);
                setServerError(true);
            });
    };

    const sort = (a, b) => {
        let nameA = parseInt(a.id), nameB = parseInt(b.id);
        if (nameA > nameB) {
            return -1;
        }
        if (nameA < nameB) {
            return 1;
        }
        return 0;
    };

    const refreshData = () => {
        setShowProgress(true);
        setServerError(false);
        setItems([]);
        setRecords(0);
        setPositionY(1000);
        clearSearchQuery();
        getItems();
    };

    const onScrollHandler = (e) => {
        if (e.nativeEvent.contentOffset.y > positionY) {
            setPositionY(positionY + 1500);
            setTimeout(() => {
                getChunk();
            }, 1000);
        }
    };

    const onChangeText = (text) => {
        let arr = [].concat(filteredItems);

        let filteredItems1 = arr.filter((el) => el.name.toLowerCase().indexOf(text.toLowerCase()) !== -1);
        setItems(filteredItems1);
        setRecords(filteredItems1.length);
        setSearchQuery(text);
    };

    const onSearch = () => {
        setShowProgress(true);
        setServerError(false);
        setItems([]);
        console.log('search ', searchQuery);
        fetch(state.url + 'api/items/findByName/' + searchQuery, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': state.token,
            },
        })
            .then((response) => response.json())
            .then(items => {
                setItems(items.sort(sort));
                setFilteredItems(items.sort(sort));
                setRecords(items.length);
                setShowProgress(false);
            })
            .catch((error) => {
                console.log('error ', error);
                setShowProgress(false);
                setServerError(true);
            });
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
                            <Image
                                style={styles.menu}
                                source={require('../../img/menu.png')}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View>
                    <TouchableWithoutFeedback>
                        <View>
                            <Text style={styles.textLarge}>
                                Collection
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View>
                    <TouchableHighlight
                        onPress={() => onSearch()}
                        underlayColor='darkblue'>
                        <View>
                            <Text style={styles.textSmall}>
                                Search
                            </Text>
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
                onScroll={onScrollHandler}

                renderItem={({item}) => (
                    <Item
                        id={item.id}
                        name={item.name}
                        group={item.group}
                        category={item.category}
                        description={item.description}
                        pic={item.pic}
                        data={{item}}
                        navigation={navigation}
                        key={item.id}
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
        paddingLeft: 20,
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

export default Items;
