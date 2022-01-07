import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Modal, Text, View } from 'react-native';
import { modalStyle } from '../../values/styles';
import AnimatedButton from './AnimatedButton';

/**
 * @typedef props
 * @property {string} props.title
 * @property {{label: string, onPress: Function}} props.positiveButton  
 * @property {{label: string, onPress: Function}} props.negativeButton
 */
const AlertModal = forwardRef((/** @type {props}*/{ title, positiveButton, negativeButton }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    useImperativeHandle(ref, () => ({
        openModal: () => setIsVisible(true),
    }));

    return (
        <Modal transparent={true} visible={isVisible} >
            <View style={modalStyle.container}>
                <View style={modalStyle.modalContainer}>
                    <Text style={[modalStyle.text, styles.title]}>{title}</Text>
                    <View style={styles.buttonsRow}>
                        <View style={styles.btnContainer}>
                            <AnimatedButton text={positiveButton.label} onPress={() => { setIsVisible(false); positiveButton.onPress() }} initAnimate={false} />
                        </View>
                        <View style={styles.btnContainer}>
                            <AnimatedButton text={negativeButton.label} onPress={() => { setIsVisible(false); negativeButton.onPress() }} initAnimate={false} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    title: {
        textAlign: 'center',
        padding: 15
    },
    btnContainer: {
        flex: 1,
        paddingStart: 10,
        paddingEnd: 10
    }
});

export default AlertModal;