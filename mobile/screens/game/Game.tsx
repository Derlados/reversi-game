import React, { useEffect, FC, useRef } from 'react';
import { StyleSheet, ImageBackground, View, BackHandler, Platform, NativeEventSubscription } from 'react-native';
import Colors from '../../values/colors';
import AlertModal, { AlertModalRef } from '../../components/AlertModal';
import Header from '../../components/Header';
import { useDispatch } from 'react-redux';
import { connect } from '../../redux/actions/GameActions'
import { makeTurn, disconnect, giveUp, pause, unpause } from '../../redux/actions/GameActions';
import GameModes from '../../constants/game-modes';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import ResultModal from './components/ResultModal';
import PlayerRow from './components/PlayerRow';
import Field from './components/Field';
import GameTimer from './components/GameTimer';
import { MainNavigationProp } from '../../navigation/types';
import { MainRoutes } from '../../navigation/routes';
import AnimatedLoadingText from '../screensaver/components/AnimatedText';
import ScreenSaver from '../screensaver/ScreenSaver';

type GameProps = {
    navigation: MainNavigationProp<MainRoutes.GAME>
}

/** TODO Нужно переделать*/
const Game: FC<GameProps> = ({ navigation }) => {
    const gameMode = useTypedSelector<GameModes>(state => state.game.gameMode);
    const isConnected = useTypedSelector<boolean>(state => state.game.isConnected);
    const dispatch = useDispatch();
    let backHandler: NativeEventSubscription;
    let alertModal = useRef<AlertModalRef>();

    useEffect(() => {
        return () => {
            dispatch(disconnect());
        }
    }, []);

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

    const onUserChoose = (x: number, y: number) => {
        dispatch(makeTurn(x, y));
    }

    const backToHome = () => {
        navigation.navigate(MainRoutes.MENU);
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
            <ImageBackground source={require('../../assets/images/background.png')} resizeMode="cover" style={styles.game}>
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
            <ImageBackground source={require('../../assets/images/background.png')} resizeMode="cover" style={styles.game}>
                <ScreenSaver />
            </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({
    game: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: Colors.PRIMARY_BACKGROUND_GREEN
    },
    gameContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '100%',
        padding: 10,
    }
});

export default Game;