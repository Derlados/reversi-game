import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default function Header({ hasMenu }) {
    const [isVolume, setIsVolume] = useState(false);

    return (
        <View style={styles.container}>
            <View>
                {hasMenu ? <Image style={styles.icon} source={require('../../assets/images/burger-bar.png')} /> : null}
            </View>
            <View>
                <Image style={styles.icon} source={isVolume ? require('../../assets/images/volume.png') : require('../../assets/images/mute.png')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10
    },
    icon: {
        height: 30,
        width: 30,
    },
});
