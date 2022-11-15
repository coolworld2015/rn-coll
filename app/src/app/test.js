import React, {useState} from 'react';
import {View, TouchableHighlight, Text, Button, Dimensions, StyleSheet} from 'react-native';

const Test = () => {
    const [clicked, setClicked] = useState(false);
    const handler = () => {
        clicked === false ? setClicked(true) : setClicked(false);
        console.log(clicked.toString());
    };

    return (
        <View>
            <TouchableHighlight
                onPress={() => handler()}
                style={{
                    marginTop: Dimensions.get('window').height * .35,
                    marginLeft: '30%',
                    borderRadius: 100,
                    width: 200,
                    height: 200,
                    backgroundColor: clicked === true ? 'red' : 'blue',
                }}>
                <Text style={{marginTop: '43%', marginLeft: '30%', color: 'white', fontSize: 24, fontWeight: 'bold',}}>
                    Button
                </Text>
            </TouchableHighlight>
           {/* <Button title="Learn More"/>*/}
        </View>
    )
};

export default Test;