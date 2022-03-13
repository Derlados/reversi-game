import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './redux/reducers';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { setUserData } from './redux/actions/UserActions';
import MainNavigation from './navigation/MainNavigation';

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

const App = () => {
  const [isLoadApp, setIsLoadApp] = useState(false);
  useEffect(() => {
    StatusBar.setHidden(true);
    StatusBar.setBackgroundColor('#00000000');
  }, []);

  if (isLoadApp) {
    return (
      <Provider store={store}>
        <MainNavigation />
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

export default App;