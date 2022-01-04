import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import Checker from '../general/Checker';
import Colors from '../../constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { makeTurn } from '../../redux/actions/GameActions'

const windowWidth = Dimensions.get('window').width;

const EMPTY = 0;
const FIRST_PLAYER = 1;
const SECOND_PLAYER = 2;
const AVAILABLE_TURN = 3;

export default function Field({ fieldSize }) {
    const field = useSelector(state => state.field);
    const dispatch = useDispatch();
    console.log(field);

    const tryMakeTurn = (x, y) => {
        if (field[x][y] == AVAILABLE_TURN) {
            dispatch(makeTurn(x, y));
        }
    }

    const renderField = () => {
        return (
            <View style={styles.field}>
                {field.map((row, indexRow) => {
                    return (
                        <View key={indexRow} style={styles.row}>
                            {row.map((cell, indexColumn) => {
                                return (
                                    <TouchableWithoutFeedback key={`${indexRow}.${indexColumn}`} style={styles.cellContainer} onPress={() => tryMakeTurn(indexRow, indexColumn)} >
                                        {createCell(cell, indexRow, indexColumn)}
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        );
    }

    const createCell = (cellValue, row, column) => {

        const color = (row + column) % 2 == 0 ? styles.evenCell : styles.oddCell;

        switch (cellValue) {
            case EMPTY: {
                return (
                    <View key={`${row}.${column}.${EMPTY}`} style={[styles.cell, color]}></View>
                );
            }
            case FIRST_PLAYER: {
                return (
                    <View key={`${row}.${column}.${FIRST_PLAYER}`} style={[styles.cell, color]} >
                        <Checker initSide={Checker.BLACK_SIDE} />
                    </View>
                );
            }
            case SECOND_PLAYER: {
                return (
                    <View key={`${row}.${column}.${SECOND_PLAYER}`} style={[styles.cell, color]}>
                        <Checker initSide={Checker.WHITE_SIDE} />
                    </View>
                );
            }
            case AVAILABLE_TURN: {
                return (
                    <View key={`${row}.${column}.${AVAILABLE_TURN}`} style={[styles.cell, color]}>
                        <View style={styles.prompt}></View>
                    </View>
                );
            }
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

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.4,
        shadowRadius: 20,

        elevation: 10,
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
    },
    evenCell: {
        backgroundColor: '#038b45'
    },
    oddCell: {
        backgroundColor: '#038b45'
    },
    prompt: {
        width: '40%',
        height: '40%',
        borderRadius: 1000,
        backgroundColor: 'white',
        opacity: 0.35
    }
});
