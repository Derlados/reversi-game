import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import Loading from './Loading';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Game({ navigation }) {
    const [isReady, setIsReady] = useState(false);

    if (isReady) {
        // Game 
        return (
            <View></View >
        );
    } else {
        // Loading ...
        return (
            <Loading onFinish={() => setIsReady(true)} />
        );
    }

}

const styles = StyleSheet.create({

});
