import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import Colors from '../constants/Colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PlayerRow() {

    return (
        <View style={styles.container}>
            <View style={styles.playerContainer}>
                <Text style={[styles.text, styles.playerName]}>Player1</Text>
                <View style={styles.checkersCounter}>
                    <Text style={styles.text}>5</Text>
                </View>
            </View>
            <View style={styles.timerContainer}>
                <Text style={styles.text}>Timer : </Text>
                <View style={styles.timer}>
                    <Text style={styles.text}>18</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        height: windowHeight * 0.1,
        backgroundColor: Colors.primaryGreen,
        borderRadius: 10,
        padding: 10
    },
    playerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerName: {
        alignItems: 'center',
        fontSize: 20,
        paddingEnd: 10,
    },
    checkersCounter: {
        backgroundColor: 'black',
        borderRadius: 1000,
        width: windowHeight * 0.06,
        height: windowHeight * 0.06,
        alignItems: 'center',
        justifyContent: 'center'
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
        fontFamily: 'Poppins-Black'
    },
});
