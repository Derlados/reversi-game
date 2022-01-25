import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, Modal } from 'react-native';
import Screens from '../../constants/Screens';
import AnimatedButton from './AnimatedButton';
import { gStyle, modalStyle } from '../../values/styles';
import Rules from '../../screens/Rules';
import Colors from '../../values/colors';
import { useSelector } from 'react-redux';

/**
 * 
 * @param {object} props 
 * @param {function} props.onMenuOpen
 * @param {function} props.onResume
 * @param {object} props.navigation - навигация
 * @param {Array<{label: string, onPress: function}>} props.buttonList - список дополнительных кнопок 
 * @returns 
 */
export default function Header({ onMenuOpen, onResume, buttonList = [] }) {
    const [isVolume, setIsVolume] = useState(false);
    const [isRulesVisible, setIsRulesVisible] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const username = useSelector(state => state.user.username);

    const resume = () => {
        onResume();
        setIsMenuVisible(false);
    }

    return (
        <View style={styles.container}>
            {buttonList.length != 0 ?
                <TouchableWithoutFeedback onPress={() => { setIsMenuVisible(true); onMenuOpen(); }}>
                    <Image style={styles.icon} source={require('../../assets/images/burger-bar.png')} />
                </TouchableWithoutFeedback>
                :
                <View>
                    <Text style={styles.username}>{`User: ${username}`}</Text>
                </View>
            }
            <Modal transparent={true} visible={isMenuVisible} statusBarTranslucent >
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
            <Modal transparent={true} visible={isRulesVisible} statusBarTranslucent animationType='slide'>
                <Rules onClose={() => setIsRulesVisible(false)} />
            </Modal>
            <View style={gStyle.row}>
                <TouchableWithoutFeedback onPress={() => setIsRulesVisible(true)}>
                    <Image style={styles.icon} source={require('../../assets/images/question-mark-draw.png')} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setIsVolume(!isVolume)} >
                    <Image style={styles.icon} source={isVolume ? require('../../assets/images/volume.png') : require('../../assets/images/mute.png')} />
                </TouchableWithoutFeedback>
            </View>
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
    username: {
        color: Colors.secondaryGreen,
        fontSize: 20,
        fontWeight: 'bold'
    },
    icon: {
        height: 30,
        width: 30,
        marginStart: 2,
        marginEnd: 2,
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
