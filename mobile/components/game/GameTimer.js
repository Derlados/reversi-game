import React, { useState } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { Dimensions } from 'react-native';
import Colors from '../../constants/Colors';
import Checker from '../general/Checker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function GameTimer({ seconds }) {
    const [state, setState] = useState({ time: seconds, textColor: 'white' });
    const flexVal = new Animated.Value(state.time);
    const flexInterpolate = flexVal.interpolate({
        inputRange: [0, seconds],
        outputRange: [0, 1]
    });
    let checker;

    const passTurn = () => {
        checker.startAnim();
        setTimeout(() => {
            setState({ time: seconds, textColor: state.textColor == 'black' ? 'white' : 'black' });
        }, Checker.ANIMATION_DURATION);
    }

    if (state.time != 0) {
        Animated.timing(flexVal, {
            toValue: state.time - 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false
        }).start(() => {
            setState({ ...state, time: state.time - 1 });
        });
    } else {
        setTimeout(() => {
            passTurn();
        }, 0);
    }


    return (
        <View style={styles.container}>
            <View style={styles.counterContainer}>
                <Checker ref={child => { checker = child }} />
                <Text style={[styles.counterText, { color: state.textColor }]}>{state.time == 0 ? '' : state.time}</Text>
            </View>
            <Animated.View style={[styles.timerLine, { flex: flexInterpolate }]}></Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: 60,
    },
    counterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
    },
    counterText: {
        position: 'absolute',
        fontSize: 16,
        fontFamily: 'Poppins-Black',
        zIndex: 1
    },
    timerLine: {
        height: 20,
        backgroundColor: Colors.primaryGreen
    }
});
