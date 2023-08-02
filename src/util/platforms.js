import {NativeModules, Platform} from 'react-native';

const {RNIapIos, RNIapIosSk2, RNIapModule, RNIapAmazonModule} = NativeModules;

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isAmazon = isAndroid && !!RNIapAmazonModule;
export const isPlay = isAndroid && !!RNIapModule;
