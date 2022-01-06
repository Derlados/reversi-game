import React from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import AnimatedScreensaver from '../components/screensaver/AnimatedScreebsaver';
import AnimatedText from '../components/screensaver/AnimatedText';
import Colors from '../constants/Colors';
import Field from '../components/game/Field';
import PlayerRow from '../components/game/PlayerRow';
import GameTimer from '../components/game/GameTimer';
import ResultModal from '../components/game/ResultModal';
import Header from '../components/general/Header';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from '../redux/actions/GameActions'
import { makeTurn, turnTimeOut, leave } from '../redux/actions/GameActions';
import Screens from '../constants/Screens';

export default function Game({ navigation }) {
    const isConnected = useSelector(state => state.isConnected);
    const dispatch = useDispatch();

    const onUserChoose = (x, y) => {
        dispatch(makeTurn(x, y));
    }

    const onTimeOut = () => {
        dispatch(turnTimeOut());
    }

    const backToHome = () => {
        navigation.navigate(Screens.MENU);
    }

    if (isConnected) {
        // Game 
        return (
            <ImageBackground source={require('../assets/images/background.png')} resizeMode="cover" style={styles.game}>
                <ResultModal onAccept={backToHome} />
                <Header hasMenu={true} />
                <View style={styles.gameContainer}>
                    <PlayerRow />
                    <Field fieldSize={8} onUserChoose={onUserChoose} />
                    <GameTimer seconds={2} onTimeOut={onTimeOut} />
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
