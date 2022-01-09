import React from 'react';
import { View, StyleSheet, Text, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../../values/gradients';

export default function MenuButton({ style = {}, text, onPress, initDelay = 0, initAnimate = true }) {
    const widthAnimVal = new Animated.Value(0);
    const widthInterpolate = widthAnimVal.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });
    const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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

    const opacityAnimVal = new Animated.Value(0);

    const initAnim = () => {
        Animated.timing(widthAnimVal, animationConfigs.initConfig)
            .start(() => {
                opacityAnimVal.setValue(1);
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

    if (initAnimate) {
        setTimeout(() => {
            initAnim();
        }, initDelay);
    } else {
        widthAnimVal.setValue(1);
        opacityAnimVal.setValue(1);
    }


    return (
        <TouchableWithoutFeedback onPressIn={onPressInAnim} onPressOut={onPressOutAnim} onPress={onPress}>
            <View style={[styles.buttonContainer, style]}>
                <AnimatedLinearGradient style={[styles.button, { height: heightInterpolate, width: widthInterpolate, color: heightInterpolate }]} colors={gradients.button}>
                    <Animated.Text style={[styles.buttonText, { fontSize: fontInterpolate, opacity: opacityAnimVal }]}>{text}</Animated.Text>
                </AnimatedLinearGradient>
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

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60
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
        fontFamily: 'Poppins-SemiBold',
    },
});
