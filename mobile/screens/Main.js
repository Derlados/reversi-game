import React from 'react';
import Colors from '../constants/Colors';
import { StyleSheet, View, Image } from 'react-native';
import MenuButton from '../components/MenuButton';
import Screens from '../constants/Screens'

export default function Main({ navigation }) {

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png' }} />
            <MenuButton text="Multiplayer" initDelay={200} onPress={() => navigation.navigate(Screens.GAME)} />
            <MenuButton text="Player vs AI" initDelay={400} />
            <MenuButton text="Player vs Player" initDelay={600} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90%',
        width: '100%',
        backgroundColor: Colors.primaryBackgroundGreen
    },
    logo: {
        width: '80%',
        height: '30%',
        marginBottom: 50
    }
});
