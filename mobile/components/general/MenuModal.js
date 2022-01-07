import React from 'react';
import { StyleSheet, Modal } from 'react-native';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function MenuModal({ onAccept }) {

    return (
        <Modal transparent={true} visible={modalVisible} >

        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {

    },
});
