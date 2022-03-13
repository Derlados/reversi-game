import React, { useState, useEffect, FC } from 'react';
import { StyleSheet, Text, View, Animated, Easing, Modal } from 'react-native';
import { Dimensions } from 'react-native';
import AnimatedButton from '../../../components/AnimatedButton';
import GameValues from '../../../constants/game-values';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { IPlayer } from '../../../redux/types/game';
import Colors from '../../../values/colors';
import { gStyle } from '../../../values/styles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const results = new Map();
results.set(GameValues.VICTORY, "You win !");
results.set(GameValues.LOSE, "You lose");
results.set(GameValues.DRAW, "Draw");
results.set(GameValues.VICTORY_OPONENT_LEFT, "You win. Your opponent has left the game");
results.set(GameValues.FIRST_PLAYER_WIN, "First player win !");
results.set(GameValues.SECOND_PLAYER_WIN, "Second player win !");

interface ResultModalProps {
    onAccept: () => void;
}

const ResultModal: FC<ResultModalProps> = ({ onAccept }) => {
    const result: GameValues = useTypedSelector(state => state.game.gameState.result);
    const player1: IPlayer = useTypedSelector(state => state.game.gameState.player1);
    const player2: IPlayer = useTypedSelector(state => state.game.gameState.player2);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

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
        <Modal transparent={true} visible={modalVisible} statusBarTranslucent>
            <View style={styles.container}>
                <Animated.View style={[styles.modalContainer, { opacity: opacityVal, transform: [{ translateY: topInterpolate }], }]}>
                    <Text style={styles.text}>{results.get(result)}</Text>
                    <View style={styles.checkersResult}>
                        <View style={[styles.checkersCounter, { backgroundColor: 'black' }]}>
                            <Text style={[styles.text, styles.smallText, { color: 'white' }]}>{player1.countCheckers}</Text>
                        </View>
                        <Text style={[styles.text, styles.smallText]}>VS</Text>
                        <View style={[styles.checkersCounter, { backgroundColor: 'white' }]}>
                            <Text style={[styles.text, styles.smallText, { color: 'black' }]}>{player2.countCheckers}</Text>
                        </View>
                    </View>
                    <AnimatedButton style={styles.button} text="Back to home" onPress={() => { setModalVisible(false); onAccept(); }} />
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
        backgroundColor: Colors.PRIMARY_BACKGROUND_GREEN,
        borderRadius: 25
    },
    text: {
        ...gStyle.text,
        fontSize: 24,
        color: Colors.SECONDARY_GREEN,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 5
    },
    smallText: {
        fontSize: 20,
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
    },
    button: {
        width: '80%',
        marginTop: 10,
        marginBottom: 20
    }
});

export default ResultModal;