import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import Checker from '../general/Checker';
import { windowWidth } from '../../values/styles';

export default function Logo({ }) {

    return (
        <View style={styles.container}>
            {/* <View style={styles.checkersPair}>
                <View style={styles.checker}>
                    <Checker initSide={Checker.BLACK_SIDE} />
                </View>
                <View style={[styles.checker, { left: ((windowWidth * 0.6) * 0.5) - 80 }]}>
                    <Checker initSide={Checker.WHITE_SIDE} />
                </View>
            </View> */}
            <Image style={styles.img} source={require('../../assets/images/logo_text.png')} resizeMode={'contain'} />
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth * 0.6,
        marginBottom: 20
    },
    // checkersPair: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     width: '100%',
    //     height: 75
    // },
    // checker: {
    //     position: 'absolute',
    //     left: ((windowWidth * 0.6) * 0.5) - 20,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     width: 100,
    //     height: 100
    // },
    // text: {
    //     fontSize: 60,
    //     fontFamily: 'PermanentMarker-Regular',
    //     color: '#004b5f'
    // },
    img: {
        width: '100%',
        height: windowWidth * 0.5,
    },
});
