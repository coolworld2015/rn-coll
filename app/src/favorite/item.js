'use strict';

import React, {useContext} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image
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
                <Image
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 20,
                    }}
                    resizeMode='stretch'
                    source={{uri: item.pic}}
                />
                <Text style={styles.rowText}>
                    {item.name} - {item.group} - {item.category}
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
        flexWrap: 'wrap'
    },
    rowText: {
        flex: 1,
        padding: 5,
        backgroundColor: '#fff',
        color: 'black',
        fontWeight: 'bold',
        flexWrap: 'wrap'
    },
});

export default Item;