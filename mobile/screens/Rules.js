import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { gStyle } from '../values/styles';
import { Dimensions } from 'react-native';
import Colors from '../values/colors';

const windowWidth = Dimensions.get('window').width;

export default function Rules({ onClose }) {
    StatusBar.setTranslucent(true)

    return (
        <ScrollView style={styles.container} >
            <View style={styles.inner} showsVerticalScrollIndicator={false}>
                <Text style={[gStyle.boldText, styles.title]}>Game rules</Text>
                <Text style={[gStyle.text, styles.description]}>Reversi is a two-player strategy game played on an 8x8 board using discs that are colored white on one side and black on the other. One player plays the discs black side up while his opponent plays the discs white side up.</Text>


                <Text style={[gStyle.boldText, styles.title]}>Object of the Game</Text>
                <Text style={[gStyle.text, styles.description]}>The object of the game is to place your discs on the board so as to outflank your opponent's discs, flipping them over to your color. The player who has the most discs on the board at the end of the game wins.</Text>

                <Text style={[gStyle.boldText, styles.title]}>Start position</Text>
                <Text style={[gStyle.text, styles.description]}>Every game starts with four discs placed in the center of the board. Black goes first</Text>
                <Image style={styles.img} source={require('../assets/images/start.png')} />

                <Text style={[gStyle.boldText, styles.title]}>Game play</Text>
                <Text style={[gStyle.text, styles.description]}>Players take turns making moves. A move consists of a player placing a disc of his color on the board. The disc must be placed so as to outflank one or more opponent discs, which are then flipped over to the current player's color. Outflanking your opponent means to place your disc such that it traps one or more of your opponent's discs between another disc of your color along a horizontal, vertical or diagonal line through the board square</Text>
                <Image style={styles.img} source={require('../assets/images/flip.gif')} />
                <Text style={[gStyle.text, styles.description]}>If a player cannot make a legal move, he forfeits his turn and the other player moves again (this is also known as passing a turn). Note that a player may not forfeit his turn voluntarily. If a player can make a legal move on his turn, he must do so</Text>

                <Text style={[gStyle.boldText, styles.title]}>End game</Text>
                <Text style={[gStyle.text, styles.description]}>The game ends when neither player can make a legal move. This includes when there are no more empty squares on the board or if one player has flipped over all of his opponent's discs. The player with the most discs of his color on the board at the end of the game wins. The game is a draw if both players have the same number of discs.</Text>

            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <Image style={styles.icon} source={require('../assets/images/close.png')} />
            </TouchableWithoutFeedback>


        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        backgroundColor: Colors.primaryBackgroundGreen,
        borderColor: Colors.secondaryGreen,
        borderWidth: 3,
        borderRadius: 10,
    },
    inner: {
        alignItems: "center",
        width: "100%",
        padding: 10,
        zIndex: 1,
        marginBottom: 20
    },
    title: {
        color: Colors.secondaryGreen,
        fontSize: 24,
        fontWeight: "800",
        padding: 15,
    },
    description: {
        marginBottom: 15,
    },
    img: {
        width: windowWidth * 0.78,
        height: windowWidth * 0.78,
        marginBottom: 10,
    },
    icon: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 25,
        height: 25,
        zIndex: 2,
        tintColor: Colors.primaryGreen
    },
});
