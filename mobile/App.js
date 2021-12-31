import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './components/BottomTabs'

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
