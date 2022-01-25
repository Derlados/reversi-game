import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, ToastAndroid, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Screens from './constants/Screens';
import Game from './screens/Game';
import Menu from './screens/Menu';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './redux/reducers';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { setUserData } from './redux/actions/UserActions';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

const loadApp = async () => {
  Font.loadAsync({
    'Poppins-Black': require('./assets/fonts/Poppins-Black.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf')
  });

  const googleId = await AsyncStorageLib.getItem("@googleId");
  const username = await AsyncStorageLib.getItem("@username");
  if (googleId && username) {
    store.dispatch(setUserData(googleId, username));
  }
}


export default function App() {
  const [isLoadApp, setIsLoadApp] = useState(false);
  useEffect(() => {
    SplashScreen.hide();
    StatusBar.setHidden(true);
    StatusBar.setBackgroundColor('#00000000');
  }, []);

  if (isLoadApp) {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name={Screens.MENU}
              component={Menu}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={Screens.GAME}
              component={Game}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  } else {
    return (
      <AppLoading startAsync={loadApp}
        onFinish={() => setIsLoadApp(true)}
        onError={console.warn} />
    );

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
