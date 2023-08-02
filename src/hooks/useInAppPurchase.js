import {
  PurchaseError,
  clearProductsIOS,
  flushFailedPurchasesCachedAsPendingAndroid,
  isIosStorekit2,
  presentCodeRedemptionSheetIOS,
  promotedProductListener,
  requestPurchase,
  requestSubscription,
  useIAP,
} from 'react-native-iap';
import {constants, errorLog, isPlay} from '../util';
import {useEffect, useState} from 'react';

const useInAppPurchase = () => {
  const {
    connected,
    products,
    getProducts,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
    getSubscriptions,
    getAvailablePurchases,
    getPurchaseHistory,
    subscriptions,
    purchaseHistory,
    availablePurchases,
    promotedProductsIOS,
  } = useIAP();
  const [purchases, setPurchases] = useState([]);

  const handleGetSubscriptions = async () => {
    try {
      await getSubscriptions({skus: constants.subscriptionSkus});
    } catch (error) {
      errorLog({message: 'handleGetSubscriptions', error});
    }
  };

  const handleAvailable = async () => {
    try {
      const purchases = await getAvailablePurchases();
    } catch (error) {}
  };

  const handleHistory = async () => {
    try {
      await getPurchaseHistory();
    } catch (error) {
      // errorLog({message: 'handleGetSubscriptions', error});
    }
  };

  const handleGetProducts = async () => {
    try {
      await getProducts({skus: constants.productSkus});
    } catch (error) {
      errorLog({message: 'handleGetProducts', error});
    }
  };

  const handleBuySubscription = async (productId, offerToken) => {
    if (isPlay && !offerToken) {
      console.warn(
        `There are no subscription Offers for selected product (Only requiered for Google Play purchases): ${productId}`,
      );
    }
    try {
      let temp = await requestSubscription({
        sku: productId,
        ...(offerToken && {
          subscriptionOffers: [{sku: productId, offerToken}],
        }),
      });
    } catch (error) {
      if (error instanceof PurchaseError) {
        errorLog({message: `[${error.code}]: ${error.message}`, error});
      } else {
        errorLog({message: 'handleBuySubscription', error});
      }
    }
  };

  const handleBuyProduct = async sku => {
    try {
      await requestPurchase({skus: [sku]});
    } catch (error) {
      if (error instanceof PurchaseError) {
        errorLog({message: `[${error.code}]: ${error.message}`, error});
      } else {
        errorLog({message: 'handleBuyProduct', error});
      }
    }
  };

  const clearPaymentHistory = () => {
    setPurchases([]);
  };

  const completeTransaction = async () => {
    try {
      if (currentPurchase?.productId) {
        await finishTransaction({
          purchase: currentPurchase,
          isConsumable: false,
        });

        // setPurchases(prev => [...prev, currentPurchase]);
        setPurchases([currentPurchase]);
        clearPaymentHistory();
      } else {
        setPurchases([]);
      }
    } catch (error) {
      if (error instanceof PurchaseError) {
        errorLog({message: `[${error.code}]: ${error.message}`, error});
      } else {
        errorLog({message: 'handleBuyProduct', error});
      }
    }
  };

  useEffect(() => {
    const checkCurrentPurchase = async () => {
      if (currentPurchase) {
        setPurchases([currentPurchase]);
      } else {
        setPurchases([]);
      }
    };

    checkCurrentPurchase();
  }, [currentPurchase]);

  return {
    handleBuySubscription,
    handleGetSubscriptions,
    purchases,
    connected,
    subscriptions,
    clearPaymentHistory,
    handleGetProducts,
    handleBuyProduct,
    products,
    handleAvailable,
    handleHistory,
    purchaseHistory,
    availablePurchases,
    clearProductsIOS,
    flushFailedPurchasesCachedAsPendingAndroid,
    completeTransaction,
  };
};

export default useInAppPurchase;
