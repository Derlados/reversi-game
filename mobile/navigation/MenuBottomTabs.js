import React from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Menu from '../screens/Menu';
import Settings from '../screens/Settings';
import { Dimensions } from 'react-native';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function MenuBottomTabs() {

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabsContainer,
                tabBarShowLabel: false
            }}
        >
            <Tab.Screen
                name="Main"
                component={Menu}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tab}>
                            <Animated.Image
                                source={require('../assets/images/game.png')}
                                resizeMode="contain"
                                style={[styles.icon, { tintColor: focused ? 'white' : Colors.noFocused, height: focused ? '40%' : '32%' }]}
                            />
                            <Text style={[styles.textIcon, { color: focused ? 'white' : Colors.noFocused }]}>Play</Text>
                        </View>
                    )
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tab}>
                            <Animated.Image
                                source={require('../assets/images/settings.png')}
                                resizeMode="contain"
                                style={[styles.icon, { tintColor: focused ? 'white' : Colors.noFocused, height: focused ? '40%' : '32%' }]}
                            />
                            <Text style={[styles.textIcon, { color: focused ? 'white' : Colors.noFocused }]}>Settings</Text>
                        </View>
                    )
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabsContainer: {
        position: 'absolute',
        backgroundColor: Colors.secondaryGreen,
        height: windowHeight * 0.1
    },
    tab: {
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 50,
        marginBottom: 2,
    },
    textIcon: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600'
    }
})
