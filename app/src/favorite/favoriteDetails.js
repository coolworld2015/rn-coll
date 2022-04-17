'use strict';

import React, {useContext} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ScrollView,
    Image
} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {AppContext} from '../app/app';
import Favorite from "./favorite";

const FavoriteDetails = () => {
    const {state} = useContext(AppContext);
    const navigation = useNavigation();

    const goBack = () => {
        navigation.goBack();
    };

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
                    <TouchableWithoutFeedback>
                        <View>
                            <Text style={styles.textSmall}>
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>

            <ScrollView>
                <View style={styles.form}>
                    <View style={styles.picWrap}>
                        <Image
                            source={{uri: state.item.pic}}
                            resizeMode='stretch'
                            style={styles.img}
                        />
                    </View>

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
                            Category:
                        </Text>
                        <View style={styles.itemWrap}>
                            <Text style={styles.itemText}>
                                {state.item.category}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.itemBlock}>
                        <Text style={styles.itemTextBold}>
                            Group:
                        </Text>
                        <View style={styles.itemWrap}>
                            <Text style={styles.itemText}>
                                {state.item.group}
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

                    <TouchableHighlight
                        onPress={() => goBack()}
                        style={styles.button}>
                        <View>
                            <Text style={styles.buttonText}>
                                Back
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
        flexWrap: 'wrap',
        width: 200
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
    picWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
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
        width: 300,
        borderRadius: 20,
        margin: 10,
    },
});

export default FavoriteDetails;
