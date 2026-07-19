import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { store, persistor } from './src/redux/store';
import AppNavigation from './src/navigation/AppNavigation';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac4',
  },
};

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <AppNavigation />
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;
