import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';
import Screens from '../../constants/Screens';

export default function Header({ navigation, hasMenu }) {
    const [isVolume, setIsVolume] = useState(false);

    return (
        <View style={styles.container}>

            {hasMenu ?
                <TouchableWithoutFeedback onPress={() => setIsModalVisible(true)}>
                    <Image style={styles.icon} source={require('../../assets/images/burger-bar.png')} />
                </TouchableWithoutFeedback>
                :
                <View></View>
            }
            <TouchableWithoutFeedback>
                <Image style={styles.icon} source={isVolume ? require('../../assets/images/volume.png') : require('../../assets/images/mute.png')} />
            </TouchableWithoutFeedback>
        </View >
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
