import {createSlice} from '@reduxjs/toolkit';

const stripeSlice = createSlice({
  name: 'stripe',
  initialState: {
    publishedKey: null,
    priceId: null,
    paymentMethodId: null,
    subscriptionData: false,
    cancelSubscriptionData: null,
  },

  reducers: {
    setPublishedKey: (state, action) => {
      state.publishedKey = action.payload;
    },
    setPriceId: (state, action) => {
      state.priceId = action.payload;
    },
    setPaymentMehodId: (state, action) => {
      state.paymentMethodId = action.payload;
    },
    setSubscription: (state, action) => {
      state.subscriptionData = action.payload;
    },
    getCancelSubscription: (state, action) => {
      state.cancelSubscriptionData = action.payload;
    },

    clearSubscription: (state, action) => {
      state.subscriptionData = false;
    },
  },
});

export const {
  setPublishedKey,
  setPriceId,
  setPaymentMehodId,
  setSubscription,
  getCancelSubscription,
  clearSubscription,
} = stripeSlice.actions;

export default stripeSlice.reducer;
