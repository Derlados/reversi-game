import React, { useState } from 'react';
import { View, StyleSheet, Text, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import Colors from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function MenuButton({ text, onPress, initDelay }) {
    const [state, setState] = useState({
        textVisible: false,
        isAnimated: false
    });

    const widthAnimVal = new Animated.Value(state.isAnimated ? 1 : 0);
    const widthInterpolate = widthAnimVal.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '80%']
    });
    const AnimatedView = Animated.createAnimatedComponent(LinearGradient);

    const heightAnimVal = new Animated.Value(1);
    const heightInterpolate = heightAnimVal.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 60]
    });

    const fontAnimVal = new Animated.Value(1);
    const fontInterpolate = fontAnimVal.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 22]
    });



    const initAnim = () => {
        Animated.timing(widthAnimVal, animationConfigs.initConfig)
            .start(() => {
                setState({
                    textVisible: true,
                    isAnimated: true,
                })
            });
    }

    const onPressInAnim = () => {
        Animated.parallel([
            Animated.timing(heightAnimVal, animationConfigs.onPressInConfig),
            Animated.timing(widthAnimVal, { toValue: 0.9, duration: animationConfigs.onPressInConfig.duration, useNativeDriver: false }),
            Animated.timing(fontAnimVal, animationConfigs.onPressInConfig)
        ]).start();
    }

    const onPressOutAnim = () => {
        Animated.parallel([
            Animated.timing(heightAnimVal, animationConfigs.onPressOutConfig),
            Animated.timing(widthAnimVal, animationConfigs.onPressOutConfig),
            Animated.timing(fontAnimVal, animationConfigs.onPressOutConfig),
        ]).start();
    }

    if (!state.isAnimated) {
        setTimeout(() => {
            initAnim();
        }, initDelay);
    }

    return (
        <TouchableWithoutFeedback onPressIn={onPressInAnim} onPressOut={onPressOutAnim}>
            <View style={styles.buttonContainer}>
                <AnimatedView style={[styles.button, { height: heightInterpolate, width: widthInterpolate, color: heightInterpolate }]} colors={gradients.button}>
                    <Animated.Text style={[styles.buttonText, { fontSize: fontInterpolate }]}>{state.textVisible ? text : ''}</Animated.Text>
                </AnimatedView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const animationConfigs = {
    onPressInConfig: {
        toValue: 0,
        duration: 100,
        easing: Easing.bounce,
        useNativeDriver: false
    },
    onPressOutConfig: {
        toValue: 1,
        duration: 100,
        easing: Easing.bounce,
        useNativeDriver: false
    },
    initConfig: {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1.3),
        useNativeDriver: false
    }
}

const gradients = {
    button: [Colors.primaryGreen, '#009b5a']
};

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        height: 60,
        marginBottom: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        borderRadius: 40,
        justifyContent: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
    },
});
