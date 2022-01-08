import React from 'react';
import Colors from '../values/colors';
import { ImageBackground, StyleSheet, View, Image } from 'react-native';
import AnimatedButton from '../components/general/AnimatedButton';
import Screens from '../constants/Screens'
import Header from '../components/general/Header';
import { useDispatch } from 'react-redux';
import { reset } from '../redux/actions/GameActions';

export default function Menu({ navigation }) {
    const dispatch = useDispatch();

    const startGame = () => {
        navigation.navigate(Screens.GAME)
        dispatch(reset());
    }

    return (
        <ImageBackground source={require('../assets/images/background.png')} resizeMode="cover" style={styles.container}>
            <Header hasMenu={false} />
            <Image style={styles.logo} source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png' }} />
            <View style={styles.buttonsColumn}>
                <AnimatedButton style={styles.button} text="Multiplayer" initDelay={200} onPress={startGame} />
                <AnimatedButton style={styles.button} text="Player vs AI" initDelay={400} />
                <AnimatedButton style={styles.button} text="Player vs Player" initDelay={600} />
            </View>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
