import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import Checker from '../general/Checker';
import { useSelector } from 'react-redux';
import GameValue from '../../constants/GameValues';
// import Sound from 'react-native-sound';
// import turn from '../assets/sound/turn.mp3';

const windowWidth = Dimensions.get('window').width;

export default function Field({ onUserChoose }) {
    // Sound.setCategory('Playback');
    // const turnSound = new Sound(turn);

    const field = useSelector(state => state.game.field)
    const lastField = useSelector(state => state.game.lastField);

    const cells = [];
    for (let i = 0; i < field.length; i++) {
        cells[i] = [];
    }

    useEffect(() => {
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field.length; j++) {
                if ((field[i][j] == GameValue.FIRST_PLAYER && lastField[i][j] == GameValue.SECOND_PLAYER)
                    || (field[i][j] == GameValue.SECOND_PLAYER && lastField[i][j] == GameValue.FIRST_PLAYER)) {
                    cells[i][j].startAnim();
                }
            }
        }
    });

    const checkUserChoice = (x, y) => {
        setTimeout(() => {
            if (field[x][y] == GameValue.AVAILABLE_TURN) {
                onUserChoose(x, y);
            }
        }, 0);

    }

    const renderField = () => {
        return (
            <View style={styles.field}>
                {field.map((row, indexRow) => {
                    return (
                        <View key={indexRow} style={styles.row}>
                            {row.map((cell, indexColumn) => {
                                return (
                                    <TouchableWithoutFeedback key={`${indexRow}.${indexColumn}`} style={styles.cellContainer} onPress={() => checkUserChoice(indexRow, indexColumn)} >
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
            case GameValue.EMPTY: {
                return (
                    <View style={[styles.cell, color]}></View>
                );
            }
            case GameValue.FIRST_PLAYER: {
                return (
                    <View style={[styles.cell, color]} >
                        <Checker ref={child => { cells[row][column] = child }} initSide={Checker.BLACK_SIDE} />
                    </View>
                );
            }
            case GameValue.SECOND_PLAYER: {
                return (
                    <View style={[styles.cell, color]}>
                        <Checker ref={child => { cells[row][column] = child }} initSide={Checker.WHITE_SIDE} />
                    </View>
                );
            }
            case GameValue.AVAILABLE_TURN: {
                return (
                    <View style={[styles.cell, color]}>
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
