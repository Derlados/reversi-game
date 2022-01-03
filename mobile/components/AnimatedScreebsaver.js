import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import Checker from './Checker';
import { useIsMounted } from 'usehooks-ts';
import Colors from '../constants/Colors';

const windowWidth = Dimensions.get('window').width;

export default function AnimatedScreebsaver() {
    let cells = [];
    let currentCell = 0;
    const isMounted = useIsMounted()

    const recursiveAnimation = () => {
        setTimeout(() => {
            if (isMounted()) {
                cells[currentCell].startAnim();
                currentCell = currentCell == 3 ? 0 : currentCell + 1;
                recursiveAnimation();
            }
        }, Checker.ANIMATION_DURATION);
    }
    recursiveAnimation();


    return (
        <View style={styles.cellsContainer}>
            <View style={styles.cellsRow}>
                <View style={styles.cell}>
                    <Checker ref={child => { cells[0] = child }} />
                </View>
                <View style={styles.cell}>
                    <Checker ref={child => { cells[1] = child }} />
                </View>
            </View>
            <View style={styles.cellsRow}>
                <View style={styles.cell}>
                    <Checker ref={child => { cells[3] = child }} />
                </View>
                <View style={styles.cell}>
                    <Checker ref={child => { cells[2] = child }} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cellsContainer: {
        width: windowWidth * 0.5,
        height: windowWidth * 0.5,
    },
    cellsRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.secondaryGreen
    },
    cell: {
        flex: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    },
});
