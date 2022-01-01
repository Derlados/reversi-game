import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import AnimatedScreebsaver from '../components/AnimatedScreebsaver';
import AnimatedText from '../components/AnimatedText';
import Colors from '../constants/Colors';

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
            <View style={styles.screensaver}>
                <AnimatedScreebsaver />
                <View style={styles.textContainer}>
                    <AnimatedText loadingText={'Loading'} />
                </View>
            </View>

        );
    }

}
const styles = StyleSheet.create({
    screensaver: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryBackgroundBlue
    },
    textContainer: {
        marginTop: 25
    }
});
