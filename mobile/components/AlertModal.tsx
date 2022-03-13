import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { FC } from 'react';
import { StyleSheet, Modal, Text, View } from 'react-native';
import { modalStyle } from '../values/styles';
import AnimatedButton from './AnimatedButton';

interface IButton {
    label: string;
    onPress: () => void;
}

interface AlertModalProps {
    title: string;
    positiveButton: IButton;
    negativeButton: IButton;
}

export type AlertModalRef = {
    openModal: () => void,
}


const AlertModal: React.ForwardRefRenderFunction<AlertModalRef, AlertModalProps> = ({ title, positiveButton, negativeButton }, ref) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        openModal: () => setIsVisible(true),
    }));

    return (
        <Modal transparent={true} visible={isVisible} statusBarTranslucent>
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
};

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

export default forwardRef(AlertModal);