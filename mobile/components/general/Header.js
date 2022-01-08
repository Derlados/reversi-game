import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, Modal } from 'react-native';
import Screens from '../../constants/Screens';
import AnimatedButton from './AnimatedButton';
import { modalStyle } from '../../values/styles';

/**
 * 
 * @param {object} props 
 * @param {object} props.navigation - навигация
 * @param {Array<{label: string, onPress: function}>} props.buttonList - список дополнительных кнопок 
 * @returns 
 */
export default function Header({ buttonList = [] }) {
    const [isVolume, setIsVolume] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const resume = () => {
        setIsMenuVisible(false);
    }

    return (
        <View style={styles.container}>
            {buttonList.length != 0 ?
                <TouchableWithoutFeedback onPress={() => setIsMenuVisible(true)}>
                    <Image style={styles.icon} source={require('../../assets/images/burger-bar.png')} />
                </TouchableWithoutFeedback>
                :
                <View></View>
            }
            <Modal transparent={true} visible={isMenuVisible}>
                <View style={modalStyle.container}>
                    <View style={modalStyle.modalContainer}>
                        <Text style={[modalStyle.text, styles.title]}>Game Menu</Text>
                        <AnimatedButton initAnimate={false} style={styles.button} text="Resume" onPress={resume} />
                        <View style={styles.line}></View>
                        {buttonList.map((item, index) => {
                            return (
                                <AnimatedButton initAnimate={false} style={styles.button} key={index} text={item.label} onPress={() => { setIsMenuVisible(false); item.onPress(); }} />
                            );
                        })}
                    </View>
                </View>
            </Modal>
            <TouchableWithoutFeedback onPress={() => setIsVolume(true)}>
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
    title: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    button: {
        width: '90%',
        marginBottom: 10,
        marginTop: 10,
    },
    line: {
        width: '90%',
        height: 2,
        marginBottom: 15,
        marginTop: 15,
        backgroundColor: '#009f5c50'
    }
});
