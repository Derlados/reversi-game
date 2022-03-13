import React, { FC, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../values/colors';
import { useIsMounted } from 'usehooks-ts'

interface AnimatedTextProps {
    loadingText: string;
}

const AnimatedLoadingText: FC<AnimatedTextProps> = ({ loadingText }) => {
    const [text, setText] = useState<string>(`${loadingText} `);
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
        color: Colors.SECONDARY_GREEN,
        fontSize: 24,
        fontFamily: 'Poppins-Black'
    },
});

export default AnimatedLoadingText;