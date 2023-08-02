import {Platform} from 'react-native';

const productSkus = Platform.select({
  ios: ['1_month_plan'],
  android: ['1_month_plan'],
});

const subscriptionSkus = Platform.select({
  ios: ['1_month_plan'],
  android: ['1_month_plan'],
});

export const constants = {
  productSkus,
  subscriptionSkus,
};
