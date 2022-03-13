import React, { FC, useState } from 'react';
import Colors from '../../values/colors';
import { ImageBackground, StyleSheet, View, Modal } from 'react-native';
import AnimatedButton from '../../components/AnimatedButton';
import Header from '../../components/Header';
import Logo from '../../components/Logo';
import { useDispatch } from 'react-redux';
import { setGameMode } from '../../redux/actions/GameActions';
import GameModes from '../../constants/game-modes';
import { addMiddleware, resetMiddlewares } from 'redux-dynamic-middlewares';
import { localGameMiddleware } from '../../redux/middleware/LocalGameMiddleware';
import { netGameMiddleware } from '../../redux/middleware/NetGameMiddleware';
import RegForm from './components/RegForm';
import { MainNavigationProp } from '../../navigation/types';
import { MainRoutes } from '../../navigation/routes';
import { useTypedSelector } from '../../hooks/useTypedSelector';

type MenuProps = {
    navigation: MainNavigationProp<MainRoutes.GAME>
}

const Menu: FC<MenuProps> = ({ navigation }) => {
    const isAuthorized = useTypedSelector<boolean>(state => state.user.isAuthorized);
    const [state, setState] = useState({ isLoaded: false, isRegVisible: false }); state
    const dispatch = useDispatch();

    const registrationFinish = (isSuccess: boolean) => {
        if (isSuccess) {
            navigation.navigate(MainRoutes.GAME);
        }
        setState({ isLoaded: true, isRegVisible: false });
    }

    const startGame = (mode: GameModes) => {
        resetMiddlewares();
        dispatch(setGameMode(mode));

        if (mode === GameModes.MULTIPLAYER) {
            addMiddleware(netGameMiddleware);
            if (!isAuthorized) {
                setState({ isLoaded: true, isRegVisible: true });
            } else {
                navigation.navigate(MainRoutes.GAME)
            }
        } else {
            addMiddleware(localGameMiddleware);
            navigation.navigate(MainRoutes.GAME)
        }
    }

    return (
        <ImageBackground source={require('../../assets/images/background.png')} resizeMode="cover" style={styles.container}>
            <Modal visible={state.isRegVisible} transparent={true} statusBarTranslucent>
                <RegForm registrationFinish={registrationFinish} />
            </Modal>
            <View style={styles.head}>
                <Header />
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
        backgroundColor: Colors.PRIMARY_BACKGROUND_GREEN
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

export default Menu;