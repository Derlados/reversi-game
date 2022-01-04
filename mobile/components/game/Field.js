import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import Checker from '../general/Checker';
import Colors from '../../constants/Colors';

const windowWidth = Dimensions.get('window').width;

const EMPTY = 0;
const FIRST_PLAYER = 1;
const SECOND_PLAYER = 2;


export default function Field({ fieldSize }) {
    const field = [];

    for (let i = 0; i < fieldSize; ++i) {
        field[i] = [];

        for (let j = 0; j < fieldSize; ++j) {
            field[i][j] = 0;
        }
    }

    field[fieldSize / 2 - 1][fieldSize / 2] = SECOND_PLAYER;
    field[fieldSize / 2][fieldSize / 2 - 1] = SECOND_PLAYER;
    field[fieldSize / 2 - 1][fieldSize / 2 - 1] = FIRST_PLAYER;
    field[fieldSize / 2][fieldSize / 2] = FIRST_PLAYER;

    const renderField = () => {
        return (
            <View style={styles.field}>
                {field.map((row, indexRow) => {
                    return (
                        <View key={indexRow} style={styles.row}>
                            {row.map((cell, indexCell) => {
                                return (
                                    <TouchableWithoutFeedback key={`${indexRow}.${indexCell}`} style={styles.cellContainer}>
                                        {createCell(cell)}
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        );
    }

    const createCell = (cellValue) => {
        if (cellValue == FIRST_PLAYER) {
            return (
                <View style={styles.cell} >
                    <Checker initSide={Checker.BLACK_SIDE} />
                </View>
            );
        } else if (cellValue == SECOND_PLAYER) {
            return (
                <View style={styles.cell}>
                    <Checker initSide={Checker.WHITE_SIDE} />
                </View>
            );
        } else {
            return (
                <View style={styles.cell}></View>
            );
        }
    }

    return (
        <View style={styles.containter}>
            {renderField()}
        </View >
    );
}

const styles = StyleSheet.create({
    containter: {
        width: windowWidth * 0.95,
        height: windowWidth * 0.95,
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
