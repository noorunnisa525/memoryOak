import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  Linking,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/CustomButton';
import Text from '../../components/CustomText';
import Header from '../../components/LoggedInHeader';
import useInAppPurchase from '../../hooks/useInAppPurchase';
import {setSubscription} from '../../redux/slices/stripeSlice';
import {add_payment_history, check_plan} from '../../services/api-config';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {isAndroid, isIos} from '../../util';
import createStyles from './styles';
import DialogModal from '../../components/DialogModal';
import Ionicons from 'react-native-vector-icons/Ionicons';

function MemberShip({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [addPaymentCall, addPaymentCallResponse] = usePostApiMutation();
  const [getActiveCall, activeCallResponse] = usePostApiMutation();

  const subscriptionStatus = useSelector(
    state => state?.stripe?.subscriptionData,
  );
  const userInfoToken = useSelector(
    state => state?.user?.userData?.tokens?.access,
  );
  const dispatch = useDispatch();

  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionCancelModal, setSubscriptionCancelModal] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // checkPurchases();
        handleAvailable();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const {
    handleBuySubscription,
    handleGetSubscriptions,
    purchases,
    connected,
    subscriptions,
    clearPaymentHistory,
    products,
    handleBuyProduct,
    handleGetProducts,
    handleAvailable,
    handleHistory,
    purchaseHistory,
    availablePurchases,
    flushFailedPurchasesCachedAsPendingAndroid,
    clearProductsIOS,
    currentPurchase,
    completeTransaction,
  } = useInAppPurchase();

  useEffect(() => {
    if (connected) {
      if (Platform.OS == 'android') {
        flushFailedPurchasesCachedAsPendingAndroid();
      }
      if (Platform.OS == 'ios') {
        clearProductsIOS();
      }
      handleGetSubscriptions();
      handleGetProducts();
      handleAvailable();
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    console.log(1);
    let tempPlans = [...subscriptions];
    if (tempPlans.length > 0) {
      console.log(2);
      if (tempPlans.length == 1) {
        setAvailablePlans(tempPlans.map(v => ({...v, isSelected: true})));
      } else {
        setAvailablePlans(tempPlans.map(v => ({...v, isSelected: false})));
      }
      setLoading(false);
    } else {
      console.log(3);
      setLoading(false);
    }
  }, [subscriptions, products]);

  // useEffect(() => {
  //   checkPurchases();
  // }, [purchases, connected, availablePurchases]);

  useEffect(() => {
    if (purchases?.length > 0) {
      let data = null;
      if (Platform.OS == 'android') {
        data = {
          google_product_id: purchases[0].productId,
          google_product_token: purchases[0].purchaseToken,
          date: moment().format('YYYY-MM-DD'),
          google_package_name: purchases[0].packageNameAndroid,
          platform: 'android',
        };
      } else {
        data = {
          productId: purchases[0].productId,
          apple_token: purchases[0].transactionReceipt,
          date: moment().format('YYYY-MM-DD'),
          platform: 'apple',
          apple_package_name: purchases[0].productId,
        };
      }

      subscribePlan(data);
    }
  }, [purchases]);

  const findSelectedProduct = availablePlans => {
    let isProductSelected = availablePlans.find(
      item => item.isSelected == true,
    );

    return isProductSelected;
  };
  async function subscribePlan(myData) {
    let a = findSelectedProduct(availablePlans);

    if (Platform.OS == 'ios') {
      myData.payment_type =
        findSelectedProduct(availablePlans)?.type == 'subs'
          ? 'subscription'
          : 'product';
    } else {
      myData.payment_type =
        findSelectedProduct(availablePlans)?.productType == 'subs'
          ? 'subscription'
          : 'product';
    }
    let apiData = {
      url: add_payment_history,
      method: 'POST',
      data: myData,
      token: userInfoToken,
    };

    try {
      let activePlan = await addPaymentCall(apiData).unwrap();
      completeTransaction();
      clearPaymentHistory();
      navigation.goBack();
    } catch (e) {}
    // try {
    //   await subscriptionCall(apiData).unwrap();
    //   clearPaymentHistory();
    //   dispatch(setPremiumStatus(true));
    //   CustomSnackbar('Payment Successful', 'green');

    //   props.navigation.goBack();
    // } catch (e) {
    //   dispatch(setPremiumStatus(false));

    //   CustomSnackbar('There seems to be an issue. Please try again later');
    // }
  }

  // function checkPurchases() {
  // if (availablePurchases.length > 0) {
  //   dispatch(setSubscription(true));
  // } else {
  //   dispatch(setSubscription(false));
  // }
  // }

  const restorePurchase = async () => {
    let data = {
      url: check_plan,
      method: 'GET',
      token: userInfoToken,
    };
    try {
      let activePlan = await getActiveCall(data).unwrap();
      if (activePlan?.results?.length > 0) {
        dispatch(setSubscription(activePlan?.results[0]?.active));
      } else {
        dispatch(setSubscription(false));
      }
    } catch (e) {}
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'light-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
      />
      <View style={styles.subContainer}>
        <MaterialCommunityIcons
          name={'keyboard-backspace'}
          size={30}
          color={'black'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={styles.headerInitialText}>{'Membership'}</Text>
        <View style={{width: '10%'}}></View>
      </View>
      {!addPaymentCallResponse.isLoading && (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          <View>
            <Text style={styles.fieldText}>
              As a non-member you can only upload 10 photos per memory.
            </Text>
            <Text style={styles.textFieldTile}>
              Members finance the ethical preservation of our memories. All
              photos are stored in their original quality.
            </Text>

            <View>
              <Text style={styles.benefitText}>Membership benefits:</Text>
              <Text style={styles.benefitDetailText}>
                - Upload unlimited photos per memory
              </Text>
              <Text style={styles.benefitDetailText}>
                - Vote on charity donations
              </Text>
              <Text style={styles.benefitDetailText}>
                - Vote on advisory board members
              </Text>
            </View>

            <Text style={styles.donationText}>
              Memory Oak is committed to donating a portion of yearly profits
              back to charitable causes that our members care about.
            </Text>
          </View>
          {subscriptionStatus && (
            <Button
              style={[styles.becomeMemberButton, styles.becomeMmeberText]}
              title1="Cancel Subscription"
              onPress={() => {
                if (Platform.OS === 'ios') {
                  setSubscriptionCancelModal(true);
                } else {
                  Linking.openURL(
                    `https://play.google.com/store/account/subscriptions`,
                  );
                }
              }}
            />
          )}
          {!subscriptionStatus && (
            <>
              {loading ? (
                <ActivityIndicator size={'large'} color={'#d06ffe'} />
              ) : (
                <>
                  {isAndroid &&
                    availablePlans?.map((item, index) => {
                      return (
                        <View style={styles.memberView}>
                          <Text style={styles.monthText}>
                            {
                              item.subscriptionOfferDetails[0].pricingPhases
                                .pricingPhaseList[0].formattedPrice
                            }
                          </Text>
                          <Text style={styles.perText}>per</Text>
                          <Text style={styles.monthText}>
                            {item.title.split(' ')[0].toLowerCase()}
                          </Text>
                        </View>
                      );
                    })}
                  {isIos &&
                    availablePlans?.map((item, index) => {
                      return (
                        <View style={styles.memberView}>
                          <Text style={styles.monthText}>
                            {item.localizedPrice}
                          </Text>
                          <Text style={styles.perText}>per</Text>
                          <Text style={styles.monthText}>
                            {item.title.split(' ')[0].toLowerCase()}
                          </Text>
                        </View>
                      );
                    })}
                </>
              )}
              <Button
                style={[styles.becomeMemberButton, styles.becomeMmeberText]}
                title1="Become a Member"
                onPress={async () => {
                  let selectedProductIndex = availablePlans?.findIndex(
                    item => item.isSelected == true,
                  );
                  if (isAndroid) {
                    availablePlans[selectedProductIndex] &&
                      availablePlans[
                        selectedProductIndex
                      ]?.subscriptionOfferDetails?.map(offer => {
                        handleBuySubscription(
                          availablePlans[selectedProductIndex]['productId'],
                          offer?.offerToken,
                        );
                      });
                  }
                  if (isIos) {
                    handleBuySubscription(
                      availablePlans[selectedProductIndex]['productId'],
                    );
                  }
                }}
              />
              <Button
                style={[null, styles.restoreText]}
                onPress={() => restorePurchase()}
                title1={'Restore Purchases'}
                loading={activeCallResponse.isLoading}
                loaderPurple
              />
              <View style={styles.privacyView}>
                <Text
                  style={styles.privacyText}
                  onPress={() => {
                    Linking.openURL('https://www.memoryoak.com/terms');
                  }}>
                  Terms of Service (EULA)
                </Text>
                <Text style={styles.andText}>&</Text>
                <Text
                  style={styles.privacyText}
                  onPress={() => {
                    Linking.openURL('https://www.memoryoak.com/privacy');
                  }}>
                  Privacy Policy
                </Text>
              </View>
              <Text style={styles.subscriptionHeader}>
                Subscription Details
              </Text>
              <Text style={styles.subscriptionText}>
                {`You can find your subscription management inside your account settings for your ${
                  isIos ? 'Apple ID' : 'Play Store'
                }, which can be accessed via the ${
                  isIos ? 'App Store' : 'Play Store'
                }. There you can cancel any subscription and trial subscriptions.`}
              </Text>
            </>
          )}
        </ScrollView>
      )}
      <DialogModal
        visible={subscriptionCancelModal}
        dialogStyle={styles.modalStyle}
        children={
          <View>
            <View style={styles.rowContainer}>
              <Text style={styles.modalHeader}>Cancel Membership!</Text>
              <TouchableOpacity
                onPress={() => {
                  setSubscriptionCancelModal(false);
                }}
                style={styles.modalCloseIcon}>
                <Ionicons
                  name={'close-circle-outline'}
                  size={40}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>- Open the Settings app.</Text>
            <Text style={styles.modalText}>- Tap your name.</Text>
            <Text style={styles.modalText}>- Tap Subscriptions.</Text>
            <Text style={styles.modalText}>
              - The subscriptions button in settings on iPhone.
            </Text>
            <Text style={styles.modalText}>- Tap the subscription.</Text>
            <Text style={styles.modalText}>- Tap Cancel Subscription.</Text>
          </View>
        }
      />
    </View>
  );
}

export default MemberShip;
