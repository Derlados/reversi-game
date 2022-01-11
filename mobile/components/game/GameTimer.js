import React, { useEffect } from 'react';
import { StyleSheet, Text, Animated, Easing, View } from 'react-native';
import Colors from '../../values/colors';
import Checker from '../general/Checker';
import { useSelector } from 'react-redux';
import GameValues from '../../constants/GameValues';
import { gStyle } from '../../values/styles';

export default function GameTimer({ seconds }) {
    const currentPlayer = useSelector(state => state.currentPlayer);
    let time = useSelector(state => state.serverTime);

    const flexVal = new Animated.Value(time);
    const flexInterpolate = flexVal.interpolate({
        inputRange: [0, seconds],
        outputRange: [0, 1]
    });
    let checker;

    useEffect(() => {
        if (currentPlayer && currentPlayer != checker.getSide()) {
            checker.startAnim();
            time = '';
        }
    });

    if (time != 0) {
        Animated.timing(flexVal, {
            toValue: time - 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false
        }).start();
    }

    return (
        <View style={styles.container}>
            <View style={styles.counterContainer}>
                <Checker ref={child => { checker = child }} />
                <Text style={[[gStyle.text, styles.counterText], { color: currentPlayer == GameValues.FIRST_PLAYER ? 'white' : 'black' }]}>{time}</Text>
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
        color: '#fff'
    },
    counterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
    },
    counterText: {
        position: 'absolute',
        zIndex: 1
    },
    timerLine: {
        height: 20,
        backgroundColor: Colors.primaryGreen
    }
});
