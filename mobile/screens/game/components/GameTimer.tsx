import React, { FC, useEffect } from 'react';
import { StyleSheet, Text, Animated, Easing, View } from 'react-native';
import { useSelector } from 'react-redux';
import Checker from '../../../components/Checker';
import GameValues from '../../../constants/game-values';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import Colors from '../../../values/colors';
import { gStyle } from '../../../values/styles';

interface GameTimerProps {
    seconds: number;
}

const GameTimer: FC<GameTimerProps> = ({ seconds }) => {
    const currentPlayer: number = useTypedSelector(state => state.game.gameState.currentPlayer);
    let time: number | null = useTypedSelector(state => state.game.gameState.serverTime);
    let checker: Checker;

    // Полоска таймера
    const stringAnim = new Animated.Value(time);
    const stringInterpolate = stringAnim.interpolate({
        inputRange: [0, seconds],
        outputRange: [0, 1]
    });

    useEffect(() => {
        if (currentPlayer && currentPlayer != checker.getSide()) {
            checker.startAnim();
            time = null;
        }
    });

    if (time != 0) {
        Animated.timing(stringAnim, {
            toValue: time - 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false
        }).start();
    }

    return (
        <View style={styles.container}>
            <View style={styles.counterContainer}>
                <Checker ref={child => { checker = child; }} />
                <Text style={[[gStyle.text, styles.counterText], { color: currentPlayer == GameValues.FIRST_PLAYER ? 'white' : 'black' }]}>{time ?? ''}</Text>
            </View>
            <Animated.View style={[styles.timerLine, { flex: stringInterpolate }]}></Animated.View>
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
        backgroundColor: Colors.PRIMARY_GREEN
    }
});

export default GameTimer;