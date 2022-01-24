import React, { useState } from 'react';
import Colors from '../values/colors';
import { ImageBackground, StyleSheet, View, Image, TextInput, Modal, Text, ToastAndroid } from 'react-native';
import AnimatedButton from '../components/general/AnimatedButton';
import Screens from '../constants/Screens'
import Header from '../components/general/Header';
import Logo from '../components/general/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { setGameMode } from '../redux/actions/GameActions';
import GameModes from '../constants/GameModes';
import { addMiddleware, resetMiddlewares } from 'redux-dynamic-middlewares';
import { localGameMiddleware } from '../redux/middleware/LocalGameMiddleware';
import { netGameMiddleware } from '../redux/middleware/NetGameMiddleware';
import RegForm from '../components/menu/RegForm';


export default function Menu({ navigation }) {
    const isAuthorized = useSelector(state => state.user.isAuthorized);

    const [state, setState] = useState({ isLoaded: false, isRegVisible: false }); state
    const dispatch = useDispatch();

    const registrationFinish = (isSuccess) => {
        if (isSuccess) {
            navigation.navigate(Screens.GAME);
        }
        setState({ isLoaded: true, isRegVisible: false });
    }

    const startGame = (mode) => {
        resetMiddlewares();
        dispatch(setGameMode(mode));

        if (mode === GameModes.MULTIPLAYER) {
            addMiddleware(netGameMiddleware);
            if (!isAuthorized) {
                setState({ isLoaded: true, isRegVisible: true });
            } else {
                navigation.navigate(Screens.GAME)
            }
        } else {
            addMiddleware(localGameMiddleware);
            navigation.navigate(Screens.GAME)
        }
    }

    return (
        <ImageBackground source={require('../assets/images/background.png')} resizeMode="cover" style={styles.container}>
            <Modal visible={state.isRegVisible} transparent={true} statusBarTranslucent>
                <RegForm registrationFinish={registrationFinish} />
            </Modal>
            <View style={styles.head}>
                <Header hasMenu={false} />
            </View>
            <Logo />
            <View style={styles.buttonsColumn}>
                <AnimatedButton style={styles.button} text="Multiplayer" initAnimate={!state.isLoaded} initDelay={200} onPress={() => startGame(GameModes.MULTIPLAYER)} />
                <AnimatedButton style={styles.button} text="Player vs AI" initAnimate={!state.isLoaded} initDelay={400} onPress={() => startGame(GameModes.PLAYER_VS_AI)} />
                <AnimatedButton style={styles.button} text="Player vs Player" initAnimate={!state.isLoaded} initDelay={600} onPress={() => startGame(GameModes.PLAYER_VS_PLAYER)} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    head: {
        position: 'absolute',
        width: '100%',
        top: 0,
        zIndex: 1,
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: Colors.primaryBackgroundGreen
    },
    logo: {
        width: '80%',
        height: '30%',
        marginBottom: 50
    },
    buttonsColumn: {
        width: '80%',
    },
    button: {
        marginBottom: 25,
    },
    regContainer: {
        width: '100%',
    }
});
