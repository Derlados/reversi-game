import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { useSelector } from 'react-redux';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { IPlayer } from '../../../redux/types/game';
import Colors from '../../../values/colors';

export default function PlayerRow() {
    const player1: IPlayer = useTypedSelector(state => state.game.gameState.player1);
    const player2: IPlayer = useTypedSelector(state => state.game.gameState.player2);

    return (
        <View style={styles.container}>
            <View style={styles.playerContainer}>
                <Text style={[styles.text, styles.playerName]}>{player1.username}</Text>
                <View style={[styles.checkersCounter, { backgroundColor: 'black' }]}>
                    <Text style={styles.text}>{player1.countCheckers}</Text>
                </View>
            </View>
            <Text style={styles.text}>VS</Text>
            <View style={styles.playerContainer}>
                <View style={[styles.checkersCounter, { backgroundColor: 'white' }]}>
                    <Text style={[styles.text, { color: 'black' }]}>{player2.countCheckers}</Text>
                </View>
                <Text style={[styles.text, styles.playerName]}>{player2.username}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: windowHeight * 0.1,
        backgroundColor: Colors.PRIMARY_GREEN,
        borderRadius: 10,
        padding: 15
    },
    playerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerName: {
        alignItems: 'center',
        fontSize: 18,
    },
    checkersCounter: {
        borderRadius: 1000,
        width: windowHeight * 0.06,
        height: windowHeight * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
        marginStart: 10,
        marginEnd: 10
    },
    timerContainer: {
        flexDirection: 'row',
    },
    timer: {
        paddingStart: 10,
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold'
    },
});
