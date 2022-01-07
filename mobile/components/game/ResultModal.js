import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Easing, Modal } from 'react-native';
import { Dimensions } from 'react-native';
import AnimatedButton from '../general/AnimatedButton';
import { gStyle } from '../../values/styles';
import Colors from '../../values/colors';
import GameValues from '../../constants/GameValues';
import { useSelector } from 'react-redux';
import { store } from '../../redux/reducers/GameReducer';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const results = new Map();
results.set(GameValues.VICTORY, "You win !");
results.set(GameValues.LOSE, "You lose");
results.set(GameValues.DRAW, "Draw");

export default function ResultModal({ onAccept }) {
    const result = useSelector(state => state.result);
    const countCheckers = [store.getState().countCheckersP1, store.getState().countCheckersP2];
    const [modalVisible, setModalVisible] = useState(false);

    const opacityVal = new Animated.Value(0.2);
    const topVal = new Animated.Value(0);
    const topInterpolate = topVal.interpolate({
        inputRange: [0, 1],
        outputRange: [windowHeight * 0.5, 0]
    });

    useEffect(() => {
        if (result != null) {
            setTimeout(() => setModalVisible(true), 1000);
        }
    });

    if (modalVisible) {
        Animated.parallel([
            Animated.timing(opacityVal, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(topVal, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start();
    }

    return (
        <Modal transparent={true} visible={modalVisible} >
            <View style={styles.container}>
                <Animated.View style={[styles.modalContainer, { opacity: opacityVal, transform: [{ translateY: topInterpolate }], }]}>
                    <Text style={styles.text}>{results.get(result)}</Text>
                    <View style={styles.checkersResult}>
                        <View style={[styles.checkersCounter, { backgroundColor: 'black' }]}>
                            <Text style={[styles.text, styles.smallText, { color: 'white' }]}>{countCheckers[0]}</Text>
                        </View>
                        <Text style={[styles.text, styles.smallText]}>VS</Text>
                        <View style={[styles.checkersCounter, { backgroundColor: 'white' }]}>
                            <Text style={[styles.text, styles.smallText, { color: 'black' }]}>{countCheckers[1]}</Text>
                        </View>
                    </View>
                    <AnimatedButton text="Back to home" onPress={() => { onAccept(); setModalVisible(false); }} />
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '95%',
        height: 250,
        backgroundColor: Colors.primaryBackgroundGreen,
        borderRadius: 25
    },
    text: {
        ...gStyle.text,
        fontSize: 36,
        color: Colors.secondaryGreen,
        fontWeight: 'bold'
    },
    smallText: {
        fontSize: 24,
    },
    checkersCounter: {
        borderRadius: 1000,
        width: windowHeight * 0.07,
        height: windowHeight * 0.07,
        alignItems: 'center',
        justifyContent: 'center',
        marginStart: 10,
        marginEnd: 10
    },
    checkersResult: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
