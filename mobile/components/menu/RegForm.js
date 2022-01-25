import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import { Dimensions } from 'react-native';
import { gStyle, modalStyle } from '../../values/styles';
import Colors from '../../values/colors';
import { login, registration } from '../../redux/actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export default function RegForm({ registrationFinish }) {
    const [state, setState] = useState({ googleId: -1, username: '', opacity: 0, errors: {}, errorIsShown: false });
    const regError = useSelector(state => state.user.serverError);
    const isRegistered = useSelector(state => state.user.isRegistered);
    const MIN_USERNAME_LENGTH = 3;
    const MAX_USERNAME_LENGTH = 16;
    const dispatch = useDispatch();

    if (!state.errorIsShown) {
        if (regError == "Not found") {
            setState({ ...state, opacity: 1, errorIsShown: true });
        } else if (regError == "Server error. Please try again later") {
            ToastAndroid.show(regError, ToastAndroid.SHORT);
            registrationFinish(false);
        } else if (regError) {
            ToastAndroid.show(regError, ToastAndroid.SHORT);
            setState({ ...state, errorIsShown: true });
        }
    }

    if (isRegistered) {
        registrationFinish(true);
    }

    useEffect(() => {
        signIn();
    }, []);

    const signIn = async () => {
        GoogleSignin.configure({
            androidClientId: `27588302935-q57rh259ksd4vk247fos56fm1te8pe2n.apps.googleusercontent.com`,
        });

        GoogleSignin.hasPlayServices().then((hasPlayService) => {
            if (hasPlayService) {
                GoogleSignin.signIn().then((userInfo) => {
                    dispatch(login(userInfo.user.id))
                    setState({ ...state, googleId: userInfo.user.id });
                }).catch((e) => {
                    ToastAndroid.show("Please sign in google to play in multiplayer mode", ToastAndroid.SHORT);
                    registrationFinish(false);
                })
            }
        }).catch((e) => {
            ToastAndroid.show("Please sign in google to play in multiplayer mode", ToastAndroid.SHORT);
            registrationFinish(false);
        })
    }

    const tryReg = () => {
        const errors = {};
        const username = state.username;

        if (username === "" || username.length < MIN_USERNAME_LENGTH) {
            errors.username = "Username must be not empty and contain more then 3 characters";
            setState({ ...state, errors: errors });
        } else {
            dispatch(registration(state.googleId, username))
            setState({ ...state, errorIsShown: false });
        }
    }

    return (
        <View style={modalStyle.container}>
            <View style={[modalStyle.modalContainer, { opacity: state.opacity }]}>
                <TextInput
                    onFocus={() => { }}
                    maxLength={MAX_USERNAME_LENGTH}
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
