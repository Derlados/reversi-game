import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function Field({ fieldSize }) {

    const renderField = (fieldSize) => {
        const field = new Array(fieldSize);
        for (var i = 0; i < fieldSize; ++i) {
            field[i] = new Array(fieldSize);
            for (var j = 0; j < fieldSize; ++j) {
                field[i][j] = new CellAnimation();
            }
        }

        return (
            <View style={styles.field}>
                {field.map((row, index) => {
                    return (
                        <View key={index} style={styles.row}>
                            {row.map((cell) => {

                                return (
                                    <TouchableWithoutFeedback style={styles.cellContainer} onPress={() => cell.startAnim()}>
                                        <View style={styles.cell} >
                                            <View style={styles.checker}>
                                                <Animated.View style={[styles.checker_first, { transform: [{ rotateY: cell.rotateInterpolate }], zIndex: cell.zIndexValueFirst }]} ></Animated.View>
                                                <Animated.View style={[styles.checker_second, { transform: [{ rotateY: cell.rotateInterpolate }, { translateX: cell.leftPosAnimVal }], zIndex: cell.zIndexValueSecond, }]} ></Animated.View>

                                            </View>
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

    return (
        <View style={styles.containter}>
            {renderField(fieldSize)}
        </View >
    );
}

class CellAnimation {
    constructor() {
        this.zIndexFirst = 0;
        this.zIndexSecond = 1;

        this.zIndexValueFirst = new Animated.Value(0);
        this.zIndexValueSecond = new Animated.Value(1);

        this.rotateAnimVal = new Animated.Value(0);
        this.rotateInterpolate = this.rotateAnimVal.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        });

        this.leftPosAnimVal = new Animated.Value(0);
    }

    startAnim() {
        this.rotateAnimVal.addListener((value) => {
            if (value.value > 0.5) {
                this.zIndexFirst = this.zIndexFirst == 1 ? 0 : 1
                this.zIndexSecond = this.zIndexSecond == 1 ? 0 : 1

                this.zIndexValueFirst.setValue(this.zIndexFirst);
                this.zIndexValueSecond.setValue(this.zIndexSecond);

                this.rotateAnimVal.removeAllListeners()
            }
        });

        Animated.timing(this.rotateAnimVal, {
            toValue: 1,
            duration: 700,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => {
            this.rotateAnimVal.setValue(0)
        });

        Animated.timing(this.leftPosAnimVal, {
            toValue: 5,
            duration: 350,
            useNativeDriver: true
        }).start(() => {
            this.leftPosAnimVal.setValue(-5);
            Animated.timing(this.leftPosAnimVal, {
                toValue: 0,
                duration: 350,
                useNativeDriver: true
            }).start()
        });
    }
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
        borderWidth: 1
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
        backgroundColor: '#e7c795',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    },
    checker: {
        width: '80%',
        height: '80%',
    },
    checker_first: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 1000,
        backgroundColor: 'white'
    },
    checker_second: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        borderRadius: 1000,
        backgroundColor: 'black'
    }
});
