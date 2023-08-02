import React, {useEffect, useState} from 'react';
import GlobalFont from 'react-native-global-font';
// import {StripeProvider} from '@stripe/stripe-react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/redux/store';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/index';
import {LogBox, SafeAreaView} from 'react-native';
import {withIAPContext} from 'react-native-iap';

function App() {
  const [publishableKey, setPublishableKey] = useState('');
  const key =
    'pk_test_51KhYBUJgDhuwILhPIiI2ynYpY13WsfzXLbddQxQu7cI8iWwtwsZjIPhYa2uC61KZOyiwoR7UQClrWDme9YCMcGxH00W30GeJvt';
  const fetchKey = () => {
    return key;
  };
  const fetchPublishableKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
    setPublishableKey(key);
  };

  LogBox.ignoreAllLogs();

  useEffect(() => {
    fetchPublishableKey();
    let fontName = 'Quicksand';
    GlobalFont.applyGlobal(fontName);
    SplashScreen.hide();
  });
  return (
    <>
      {/* <StripeProvider
        publishableKey={
          'pk_test_51KZxXxA8rHOvRpv9jZUri6LuBJtlbkALWHDB3uK7WxX7Vz5hwR2lB40umRnOfHqFyzZyormJdjRaw2kGfzq93WTO00i774K8s0'
        }
        merchantIdentifier="merchant.identifier"> */}
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
      {/* </StripeProvider> */}
    </>
  );
}

export default withIAPContext(App);
