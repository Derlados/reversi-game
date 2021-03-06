import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import Colors from './colors';

export const windowWidth: number = Dimensions.get('window').width;
export const windowHeight: number = Dimensions.get('window').height;

export const gStyle = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold'
    },
    boldText: {
        fontSize: 16,
        fontFamily: 'Poppins-Black'
    },
    button: {
        flex: 1,
        width: '100%',
        height: 60,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        margin: 10
    }
})

export const modalStyle = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '95%',
        backgroundColor: Colors.PRIMARY_BACKGROUND_GREEN,
        borderRadius: 25,
        padding: 15
    },
    text: {
        ...gStyle.text,
        fontSize: 24,
        color: Colors.SECONDARY_GREEN,
        fontWeight: "600"
    },
    btnText: {
        ...gStyle.text,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    }
});

