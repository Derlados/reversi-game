import React, { useState, useEffect, createRef } from 'react';
import { StyleSheet, ImageBackground, View, BackHandler, Platform } from 'react-native';
import AnimatedScreensaver from '../components/screensaver/AnimatedScreebsaver';
import AnimatedText from '../components/screensaver/AnimatedText';
import Colors from '../values/colors';
import Field from '../components/game/Field';
import PlayerRow from '../components/game/PlayerRow';
import GameTimer from '../components/game/GameTimer';
import ResultModal from '../components/game/ResultModal';
import AlertModal from '../components/general/AlertModal';
import Header from '../components/general/Header';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from '../redux/actions/GameActions'
import { makeTurn, disconnect, giveUp, pause, unpause } from '../redux/actions/GameActions';
import Screens from '../constants/Screens';
import GameModes from '../constants/GameModes';

export default function Game({ navigation }) {
    console.log("render");
    const gameMode = useSelector(state => state.gameMode);
    const isConnected = useSelector(state => state.isConnected);
    const dispatch = useDispatch();
    let backHandler;
    let alertModal = createRef();



    useEffect(() => {
        if (Platform.OS == 'android') {
            backHandler = BackHandler.addEventListener("hardwareBackPress", backHandle);
        }

        return () => {
            if (Platform.OS == 'android') {
                backHandler.remove();
            }
        }
    });

    useEffect(() => {
        return () => {
            dispatch(disconnect());
        }
    }, []);

    const backHandle = () => {
        if (isConnected) {
            alertModal.current.openModal();
            onPause();
            return true;
        } else {
            dispatch(disconnect());
            return false;
        }
    }

    const onUserChoose = (x, y) => {
        dispatch(makeTurn(x, y));
    }

    const backToHome = () => {
        navigation.navigate(Screens.MENU);
        dispatch(disconnect());
    }

    const unPause = () => {
        dispatch(unpause());
    }

    const onPause = () => {
        dispatch(pause());
    }

    const onGiveUp = () => {
        dispatch(giveUp());
    }

    if (isConnected) {
        // Game 
        return (
            <ImageBackground source={require('../assets/images/background.png')} resizeMode="cover" style={styles.game}>
                <ResultModal onAccept={backToHome} />
                <AlertModal
                    ref={alertModal}
                    title="Are you sure you want to leave ?"
                    positiveButton={{ label: 'Yes', onPress: backToHome }}
                    negativeButton={{ label: 'No', onPress: unPause }} />
                <Header onMenuOpen={onPause} onResume={unPause} buttonList={[gameMode == GameModes.MULTIPLAYER ? { label: "Give up", onPress: onGiveUp } : { label: "Back to home", onPress: backToHome }]} />
                <View style={styles.gameContainer}>
                    <PlayerRow />
                    <Field onUserChoose={onUserChoose} />
                    <GameTimer seconds={60} />
                </View>
            </ImageBackground>
        );
    } else {
        dispatch(connect());
        // Loading ...
        return (
            <ImageBackground source={require('../assets/images/background.png')} resizeMode="cover" style={styles.game}>
                <View style={styles.screensaver}>
                    <AnimatedScreensaver />
                    <View style={styles.textContainer}>
                        <AnimatedText loadingText={'Loading'} />
                    </View>
                </View>
            </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({
    screensaver: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainer: {
        marginTop: 25
    },
    game: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: Colors.primaryBackgroundGreen
    },
    gameContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '100%',
        padding: 10,
    }
});
