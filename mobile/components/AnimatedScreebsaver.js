import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native';
import Cell from '../components/Cell';
import { useIsMounted } from 'usehooks-ts'

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
        }, Cell.ANIMATION_DURATION);
    }
    recursiveAnimation();


    return (
        <View style={styles.cellsContainer}>
            <View style={styles.cellsRow}>
                <Cell ref={child => { cells[0] = child }} />
                <Cell ref={child => { cells[1] = child }} />
            </View>
            <View style={styles.cellsRow}>
                <Cell ref={child => { cells[3] = child }} />
                <Cell ref={child => { cells[2] = child }} />
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
        flexDirection: 'row'
    },
});
