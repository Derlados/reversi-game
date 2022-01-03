import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import AnimatedScreebsaver from '../components/AnimatedScreebsaver';
import AnimatedText from '../components/AnimatedText';
import Colors from '../constants/Colors';
import Field from '../components/Field';
import PlayerRow from '../components/PlayerRow';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Game({ navigation }) {
    const [isReady, setIsReady] = useState(true);

    if (isReady) {
        // Game 
        return (
            <View style={styles.game}>
                <PlayerRow />
                <Field fieldSize={8} />
                <PlayerRow />
            </View>
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
    },
    game: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: Colors.primaryBackgroundGreen
    }
});
