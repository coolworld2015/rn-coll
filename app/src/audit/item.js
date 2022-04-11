'use strict';

import React, {useContext} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';

import {AppContext} from "../app/app";
import {useNavigation} from '@react-navigation/core';

const Item = (item) => {
    const {state, setContextState} = useContext(AppContext);
    const navigation = useNavigation();
    return (
        <TouchableHighlight
            onPress={() => {
                setContextState({...state, ...{item: item}});
                navigation.navigate('Details');
            }
            }
            underlayColor='#ddd'>
            <View style={styles.row}>
                <Text style={styles.rowText}>
                    {item.name} - {item.date} - {item.description}
                </Text>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
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