import React from 'react';
import Colors from '../values/colors';
import { ImageBackground, StyleSheet, View, Image } from 'react-native';
import AnimatedButton from '../components/general/AnimatedButton';
import Screens from '../constants/Screens'
import Header from '../components/general/Header';
import Logo from '../components/general/Logo';
import { useDispatch } from 'react-redux';
import { setGameMode } from '../redux/actions/GameActions';
import GameModes from '../constants/GameModes';


export default function Menu({ navigation }) {
    const dispatch = useDispatch();

    const startGame = (mode) => {
        navigation.navigate(Screens.GAME)
        dispatch(setGameMode(mode));
    }

    return (
        <ImageBackground source={require('../assets/images/background.png')} resizeMode="cover" style={styles.container}>
            <View style={styles.head}>
                <Header hasMenu={false} />
            </View>
            <Logo />
            <View style={styles.buttonsColumn}>
                <AnimatedButton style={styles.button} text="Multiplayer" initDelay={200} onPress={() => startGame(GameModes.MULTIPLAYER)} />
                <AnimatedButton style={styles.button} text="Player vs AI" initDelay={400} />
                <AnimatedButton style={styles.button} text="Player vs Player" initDelay={600} onPress={() => startGame(GameModes.PLAYER_VS_PLAYER)} />
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
    }
});
