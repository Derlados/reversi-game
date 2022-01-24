import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import AnimatedButton from '../general/AnimatedButton';
import { Dimensions } from 'react-native';
import { gStyle, modalStyle } from '../../values/styles';
import Colors from '../../values/colors';
import * as GoogleSignIn from 'expo-google-app-auth';
import { registration } from '../../redux/actions/UserActions';
import { useDispatch } from 'react-redux';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export default function RegForm({ close }) {
    const [state, setState] = useState({ googleId: -1, username: '', opacity: 0, errors: {} });
    const MIN_USERNAME_LENGTH = 3;
    const dispatch = useDispatch();

    useEffect(() => {
        signIn();
    }, []);

    const signIn = async () => {
        try {
            const { user } = await GoogleSignIn.logInAsync({
                androidClientId: `27588302935-lvjp4rmrts0rl3p34qm00tuf7t56g8v8.apps.googleusercontent.com`,
            });
            setState({ ...state, googleId: user.id, opacity: 1 });
        } catch ({ message }) {
            ToastAndroid.show("Please sign in google to play in multiplayer mode", ToastAndroid.SHORT);
        }
    }

    const tryReg = () => {
        const errors = {};
        const username = state.username;

        if (username === "" || username.length < MIN_USERNAME_LENGTH) {
            errors.username = "Username must be not empty and contain more then 3 characters";
            setState({ ...state, errors: errors });
        } else {
            close();
            dispatch(registration(state.googleId, username))

        }
    }

    return (
        <View style={modalStyle.container}>
            <View style={[modalStyle.modalContainer, { opacity: state.opacity }]}>
                <TextInput
                    onFocus={() => { }}
                    maxLength={10}
                    style={[gStyle.text, styles.input]}
                    onChangeText={(username) => setState({ ...state, username: username })}
                    placeholder="Enter your nickname"
                />
                {state.errors?.username && <Text style={styles.error}>{state.errors.username}</Text>}
                <TouchableWithoutFeedback onPress={tryReg}>
                    <View style={styles.button}>
                        <Text style={modalStyle.btnText}>Submit</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        padding: 5,
        margin: 10,
        borderWidth: 1,
        borderColor: '#00000000',
        borderBottomColor: '#8d8d8d75',
        textAlign: 'center',
        color: Colors.secondaryGreen,
    },
    error: {
        color: 'red',
        fontSize: 14,

    },
    button: {
        alignItems: 'center',
        width: '100%',
        margin: 10,
        padding: 5,
        borderRadius: 15,
        backgroundColor: Colors.primaryGreen,
    }
});
