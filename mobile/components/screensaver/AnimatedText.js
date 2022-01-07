import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../values/colors';
import { useIsMounted } from 'usehooks-ts'

export default function AnimatedText({ loadingText }) {
    const [text, setText] = useState(`${loadingText} `);
    const isMounted = useIsMounted()

    setTimeout(() => {
        if (isMounted()) {
            if (text == `${loadingText} ...`) {
                setText(`${loadingText} `);
            } else {
                setText(text + '.');
            }
        }
    }, 1000);

    return (
        <Text style={styles.text}>{text}</Text>
    );
}

const styles = StyleSheet.create({
    text: {
        color: Colors.secondaryGreen,
        fontSize: 24,
        fontFamily: 'Poppins-Black'
    },
});
