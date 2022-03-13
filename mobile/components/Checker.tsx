import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Dimensions } from 'react-native';
import Colors from '../values/colors';
import GameValues from '../constants/game-values';
import { FC } from 'react';

interface Props {
    initSide?: number;
}

export default class Checker extends React.Component<Props> {
    static ANIMATION_DURATION: number = 700;
    static BLACK_SIDE: number = GameValues.FIRST_PLAYER;
    static WHITE_SIDE: number = GameValues.SECOND_PLAYER;

    initSide: number;

    zIndexFirst: number;
    zIndexSecond: number;
    zIndexValueFirst: Animated.Value;
    zIndexValueSecond: Animated.Value;
    rotateAnimVal: Animated.Value;
    rotateInterpolate: Animated.AnimatedInterpolation;
    leftPosAnimVal: Animated.Value;

    constructor(props: Props) {
        super(props);
        this.initSide = this.props.initSide ?? Checker.BLACK_SIDE;

        this.zIndexFirst = this.initSide == Checker.BLACK_SIDE ? 1 : 0;
        this.zIndexSecond = this.initSide == Checker.WHITE_SIDE ? 1 : 0;

        this.zIndexValueFirst = new Animated.Value(this.zIndexFirst);
        this.zIndexValueSecond = new Animated.Value(this.zIndexSecond);

        this.rotateAnimVal = new Animated.Value(0);
        this.rotateInterpolate = this.rotateAnimVal.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg']
        });

        this.leftPosAnimVal = new Animated.Value(0);
    }

    getSide() {
        if (this.zIndexFirst == 1) {
            return Checker.BLACK_SIDE;
        } else {
            return Checker.WHITE_SIDE;
        }
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
            duration: Checker.ANIMATION_DURATION,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => {
            this.rotateAnimVal.setValue(0)
        });

        Animated.timing(this.leftPosAnimVal, {
            toValue: 4,
            duration: Checker.ANIMATION_DURATION / 2,
            useNativeDriver: true
        }).start(() => {
            this.leftPosAnimVal.setValue(-4);
            Animated.timing(this.leftPosAnimVal, {
                toValue: 0,
                duration: Checker.ANIMATION_DURATION / 2,
                useNativeDriver: true
            }).start();
        });
    }

    render() {
        return (
            <View style={styles.checker}>
                <Animated.View style={[styles.checkerSide, { backgroundColor: 'black', transform: [{ rotateY: this.rotateInterpolate }], zIndex: this.zIndexValueFirst, left: 0 }]} ></Animated.View>
                <Animated.View style={[styles.checkerSide, { backgroundColor: 'white', transform: [{ rotateY: this.rotateInterpolate }, { translateX: this.leftPosAnimVal }], zIndex: this.zIndexValueSecond, }]} ></Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        borderColor: 'black',
        backgroundColor: Colors.SECONDARY_GREEN,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    },
    checker: {
        width: '80%',
        height: '80%',
    },
    checkerSide: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        borderRadius: 1000
    },
});
