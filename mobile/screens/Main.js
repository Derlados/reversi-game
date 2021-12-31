import React from 'react';
import Colors from '../constants/colors';
import { StyleSheet, View, Image } from 'react-native';
import MenuButton from '../components/MenuButton'

export default function Main() {

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png' }} />
            <MenuButton text="Игра по сети" initDelay={200} />
            <MenuButton text="Игра против ИИ" initDelay={400} />
            <MenuButton text="Два игрока" initDelay={600} />
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
