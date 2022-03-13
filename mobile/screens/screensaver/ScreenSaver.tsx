import React from 'react'
import { StyleSheet, View } from 'react-native'
import AnimatedScreensaver from './components/AnimatedCheckers'
import AnimatedLoadingText from './components/AnimatedText'

const ScreenSaver = () => {
    return (
        <View style={styles.screensaver}>
            <AnimatedScreensaver />
            <View style={styles.textContainer}>
                <AnimatedLoadingText loadingText={'Loading'} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screensaver: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainer: {
        marginTop: 25
    }
});


export default ScreenSaver