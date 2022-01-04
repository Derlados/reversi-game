import React from 'react';
import Colors from '../constants/Colors';
import { ImageBackground, StyleSheet, View, Image } from 'react-native';
import MenuButton from '../components/menu/MenuButton';
import Screens from '../constants/Screens'
import Header from '../components/general/Header';

export default function Menu({ navigation }) {
    return (
        <ImageBackground source={require('../assets/images/background.png')} resizeMode="cover" style={styles.container}>
            <Header hasMenu={false} />
            <Image style={styles.logo} source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png' }} />
            <MenuButton text="Multiplayer" initDelay={200} onPress={() => navigation.navigate(Screens.GAME)} />
            <MenuButton text="Player vs AI" initDelay={400} />
            <MenuButton text="Player vs Player" initDelay={600} />
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
    }
});