import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import branch from 'react-native-branch';
import {useDispatch} from 'react-redux';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {AppleIcon, GoogleIcon} from '../../components/Icons/Icons';
import {setSubscription} from '../../redux/slices/stripeSlice';
import {
  onLogin,
  setToken,
  setTokenError,
  setUser as setUserData,
  setUserByEmail,
} from '../../redux/slices/userSlice';
import {
  add_people,
  add_people_in_memory,
  get_User,
  loginApple,
  loginGoogle,
} from '../../services/api-config';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {wp} from '../../util';
import createStyles from './styles';
import jwt_decode from 'jwt-decode';
import appleAuth from '@invertase/react-native-apple-authentication';

function Login({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [googleLoginCall, googleLoginResponse] = usePostApiMutation();
  const [appleLoginCall, appleLoginResponse] = usePostApiMutation();
  const [user, setUser] = useState({});
  const [branchData, setBranchData] = useState(null);
  const dispatch = useDispatch();
  const [getUserCall, userResponse] = usePostApiMutation();
  const [addPeopleCall, peopleResponse] = usePostApiMutation();
  let _unsubscribeFromBranch = null;

  //api
  // const getFacebookLogin = async () => {
  //   let form = new FormData();
  //   let data = {
  //     url: loginFacebook,
  //     // data: form,
  //     method: 'POST',
  //     token: null,
  //   };
  //   try {
  //     let res = await loginCall(data).unwrap();
  //   } catch (e) {
  //   }
  // };
  //Api

  useEffect(() => {
    // subscribeBranch();
    // return () => {
    //   if (_unsubscribeFromBranch) {
    //     _unsubscribeFromBranch();
    //     _unsubscribeFromBranch = null;
    //   }
    // };
  }, []);

  const getGoogleLogin = async userInfo => {
    let data = {
      auth_token: userInfo.idToken,
    };
    let apiData = {
      url: loginGoogle,
      method: 'POST',
      data: data,
      token: null,
    };
    try {
      let user = await googleLoginCall(apiData).unwrap();
      getUser(user);
      dispatch(setUserData(user));

      if (branchData) {
        addFriend(
          userInfo.user.email,
          branchData.id,
          branchData.adminToken,
          branchData.group,
        );
      }
      dispatch(setTokenError(false));
      dispatch(onLogin(true));
    } catch (e) {
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
    }
  };

  const getUser = async user => {
    let data = {
      url: get_User + `${user.email}/`,
      method: 'GET',
      token: user?.tokens?.access,
    };
    try {
      let user = await getUserCall(data).unwrap();
      dispatch(setUserByEmail(user));
      // dispatch(setSubscription(user.is_premium));
      setUserData(user);
    } catch (e) {}
  };

  const googleSignIn = async () => {
    GoogleSignin.configure({
      androidClientId:
        '329969951305-ns6ue4gi1un22v2fivf24qfac2fdsksl.apps.googleusercontent.com',
      webClientId:
        '329969951305-m37h9tbsval682nmimgjtuh1lma79t64.apps.googleusercontent.com',
      iosClientId:
        '329969951305-gsir4ca7k00e6t0ke9atajrp4q3eeu6g.apps.googleusercontent.com',
      scopes: ['profile', 'email'],

      // offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo);
      getGoogleLogin(userInfo);
      dispatch(setToken(userInfo.idToken));

      GoogleSignin.signOut();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
      GoogleSignin.signOut();
    }
  };

  const subscribeBranch = async () => {
    _unsubscribeFromBranch = branch.subscribe({
      onOpenStart: ({uri, cachedInitialEvent}) => {},
      onOpenComplete: ({error, params, uri}) => {
        if (error) {
          console.error(`Error from Branch opening URI ${uri}: ${error}`);
          return;
        }

        if (!params['+clicked_branch_link']) return;

        let id = params.id;
        let adminToken = params?.token;
        let group = params?.group == 'false' ? false : true;

        if (id) {
          setBranchData({
            id,
            adminToken,
            group,
          });
        } else {
          setBranchData(null);
        }
      },
    });
  };

  const addFriend = async (email, id, token, group) => {
    let data = {
      friend_list: [email],
    };
    let apiData = {
      url: add_people,
      method: 'POST',
      data: data,
      token: token,
    };
    try {
      let user = await addPeopleCall(apiData).unwrap();

      addParticipant(email, id, token, group);
    } catch (e) {}
  };

  const addParticipant = async (email, id, token, group) => {
    let data = {
      shared_users: [email],
    };

    let apiData = {
      url: add_people_in_memory + `${id}/`,
      method: 'PATCH',
      data: data,
      token: token,
    };
    try {
      let user = await addPeopleCall(apiData).unwrap();
      if (token) {
        navigation.navigate('MemoryDetails', {item: {id}});

        // navigation.navigate('MainTab', {
        //   screen: 'Groups',
        //   params: {
        //     screen: 'GSMemory',
        //     params: {
        //       memory_id: id,
        //       homeCheck: true,
        //     },
        //   },
        // });
      } else {
        navigation.navigate('AuthStack');
      }
    } catch (error) {}
  };

  const appleSignIn = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL],
      })
      .then(async appleAuthResponse => {
        const {email, email_verified, is_private_email, sub} = jwt_decode(
          appleAuthResponse.identityToken,
        );

        let data = {
          auth_token: appleAuthResponse.authorizationCode,
        };

        let apiData = {
          url: loginApple,
          method: 'POST',
          data: data,
          token: null,
        };

        try {
          let user = await appleLoginCall(apiData).unwrap();
          getUser(user);
          dispatch(setUserData(user));

          if (branchData) {
            addFriend(
              email,
              branchData.id,
              branchData.adminToken,
              branchData.group,
            );
          }
          dispatch(setTokenError(false));
          dispatch(onLogin(true));
        } catch (e) {}
      })
      .catch(e => {});
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'light-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
      />
      <Text style={styles.headerText}>Memory Oak</Text>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        {/* <Text style={styles.loginText}>Log In</Text> */}
        <View>
          <Button
            style={[styles.socialButton, styles.socialText]}
            title1="Continue With Google"
            icon={<GoogleIcon height={wp(6)} width={wp(6)} />}
            // iconColor={'black'}
            onPress={() => !googleLoginResponse.isLoading && googleSignIn()}
            loading={googleLoginResponse.isLoading}
            loaderPurple
          />
          {Platform.OS == 'ios' && (
            <Button
              style={[styles.socialButton, styles.socialText]}
              title1="Continue With Apple"
              icon={<AppleIcon height={wp(6)} width={wp(6)} />}
              // iconColor={'black'}
              onPress={() => !appleLoginResponse.isLoading && appleSignIn()}
              loading={appleLoginResponse.isLoading}
              loaderPurple
            />
          )}
          {/* <Button
            style={[styles.socialButton, styles.socialText]}
            title1="Login With Facebook "
            icon={'facebook'}
            iconColor={'black'}
            onPress={() => navigation.navigate('NewMemory')}
          /> */}
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.loggingText}>
            By Continuing you agree to the
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://www.memoryoak.com/terms')
              }>
              <Text style={styles.termsText}>Memory Oak Terms</Text>
            </TouchableOpacity>
          </Text>
        </View>

        {/* <Button
          style={[styles.termsButton, styles.loggingText, styles.termsText]}
          title1="By logging in you agree to"
          title2="Memory Oak terms"
          onPress={() => console.log('terms')}
        /> */}
      </ScrollView>
    </View>
  );
}

export default Login;
