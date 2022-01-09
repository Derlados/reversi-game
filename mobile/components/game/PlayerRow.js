import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import Colors from '../../values/colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { useSelector } from 'react-redux';

export default function PlayerRow() {
    const playerNames = useSelector(state => [state.player1Name, state.player2Name]);
    const countCheckers = useSelector(state => [state.countCheckersP1, state.countCheckersP2]);

    return (
        <View style={styles.container}>
            <View style={styles.playerContainer}>
                <Text style={[styles.text, styles.playerName]}>{playerNames[0]}</Text>
                <View style={[styles.checkersCounter, { backgroundColor: 'black' }]}>
                    <Text style={styles.text}>{countCheckers[0]}</Text>
                </View>
            </View>
            <Text style={styles.text}>VS</Text>
            <View style={styles.playerContainer}>
                <View style={[styles.checkersCounter, { backgroundColor: 'white' }]}>
                    <Text style={[styles.text, { color: 'black' }]}>{countCheckers[1]}</Text>
                </View>
                <Text style={[styles.text, styles.playerName]}>{playerNames[1]}</Text>
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
        backgroundColor: Colors.primaryGreen,
        borderRadius: 10,
        padding: 15
    },
    playerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerName: {
        alignItems: 'center',
        fontSize: 20,
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
