import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import Checker from './Checker';
import Colors from '../constants/Colors';

const windowWidth = Dimensions.get('window').width;

export default function Field({ fieldSize }) {
    const cells = [];
    for (let i = 0; i < fieldSize; ++i) {
        cells[i] = [];
        for (let j = 0; j < fieldSize; ++j) {
            cells[i][j] = new Object();
        }
    }


    const renderField = (fieldSize) => {
        return (
            <View style={styles.field}>
                {cells.map((row, index) => {
                    return (
                        <View key={index} style={styles.row}>
                            {row.map((cell) => {
                                return (
                                    <TouchableWithoutFeedback style={styles.cellContainer} onPress={() => cell.startAnim()}>
                                        <View style={styles.cell} >
                                            <Checker ref={child => { cell = child }} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        );
    }

    const createCell = () => {

    }

    return (
        <View style={styles.containter}>
            {renderField(fieldSize)}
        </View >
    );
}

const styles = StyleSheet.create({
    containter: {
        width: windowWidth,
        height: windowWidth,
        padding: 10
    },
    field: {
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: Colors.secondaryGreen
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        height: 500
    },
    cellContainer: {
        flex: 1,
    },
    cell: {
        flex: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    }
});
