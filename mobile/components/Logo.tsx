import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { windowWidth } from '../values/styles';

/**TODO придумать красивое лого */
const Logo = () => {

    return (
        <View style={styles.container}>
            <Image style={styles.img} source={require('../assets/images/logo_text.png')} resizeMode={'contain'} />
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
    img: {
        width: '100%',
        height: windowWidth * 0.5,
    },
});


export default Logo;