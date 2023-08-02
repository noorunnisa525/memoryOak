import {useIsFocused, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useEffect} from 'react';
import branch from 'react-native-branch';
import {useDispatch, useSelector} from 'react-redux';
import {
  setFirstTime,
  setLinkExpired,
  setTokenError,
} from '../redux/slices/userSlice';
import Comment from '../screens/Comment';
import CreateMemory from '../screens/CreateMemory';
import EditMemory from '../screens/EditMemory';
import EditProfileScreen from '../screens/EditProfile';
import Login from '../screens/Login';
import MediaComment from '../screens/MediaComment';
import MemberShip from '../screens/MemberShip';
import MemoryDetails from '../screens/MemoryDetails';
import NewMemory from '../screens/NewMemory';
import People from '../screens/People';
import SharedMemories from '../screens/SharedMemories';
import ViewMemory from '../screens/ViewMemory';
import {
  add_people,
  add_people_in_memory,
  get_memory_share_users,
} from '../services/api-config';
import {usePostApiMutation} from '../services/service';

const LoggedInStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="AuthStack"
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen
        name={'Login'}
        component={Login}
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

const LoggedInNavigator = () => {
  return (
    <LoggedInStack.Navigator
      initialRouteName="LoggedInStack"
      screenOptions={{
        headerShown: false,
      }}>
      {/* <LoggedInStack.Screen
        name={'Home'}
        component={Home}
        screenOptions={{
          headerShown: false,
        }}
      /> */}
      <LoggedInStack.Screen
        name={'NewMemory'}
        component={NewMemory}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'CreateMemory'}
        component={CreateMemory}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'MemberShip'}
        component={MemberShip}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'EditProfileScreen'}
        component={EditProfileScreen}
        screenOptions={{
          headerShown: false,
        }}
      />

      <LoggedInStack.Screen
        name={'MemoryDetails'}
        component={MemoryDetails}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'EditMemory'}
        component={EditMemory}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'People'}
        component={People}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Comment'}
        component={Comment}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'ViewMemory'}
        component={ViewMemory}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'MediaComment'}
        component={MediaComment}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'SharedMemories'}
        component={SharedMemories}
        screenOptions={{
          headerShown: false,
        }}
      />
    </LoggedInStack.Navigator>
  );
};

const App = () => {
  const isLogin = useSelector(state => state.user.isLogin);
  const user_info = useSelector(state => state.user.userData);
  const userInfoToken = useSelector(
    state => state.user?.userData?.tokens?.access,
  );
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTokenError(false));
  }, []);

  const navigation = useNavigation();

  const [addPeopleCall, peopleResponse] = usePostApiMutation();
  const [getPeopleCall, getPeopleResponse] = usePostApiMutation();
  let _unsubscribeFromBranch = null;

  const timeout = () => {
    setTimeout(() => getToken(), 1000);
  };

  const getToken = async () => {};

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
      dispatch(setTokenError(false));
    } catch (e) {
      if (e?.status == 401) {
        dispatch(setTokenError(true));
      }
    }
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
      navigateToScreen(id);
    } catch (error) {
      if (error?.status == 401) {
        dispatch(setTokenError(true));
      }
    }
  };

  function navigateToScreen(id) {
    if (isLogin) {
      dispatch(setTokenError(false));

      navigation.navigate('MemoryDetails', {item: {id}, id: id});

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
      dispatch(setTokenError(false));
      navigation.navigate('AuthStack');
    }
  }

  useEffect(() => {
    _unsubscribeFromBranch = branch.subscribe({
      onOpenStart: ({uri, cachedInitialEvent}) => {},
      onOpenComplete: ({error, params, uri}) => {
        if (error) {
          console.error(`Error from Branch opening URI ${uri}: ${error}`);
          return;
        }

        if (params['+non_branch_link']) {
          const nonBranchUrl = params['+non_branch_link'];
          // Route non-Branch URL if appropriate.
          return;
        }

        if (!params['+clicked_branch_link']) {
          // Indicates initialization success and some other conditions.
          // No link was opened.
          return;
        }

        // A Branch link was opened
        const url = params.$canonical_url;

        let id = params.id;
        let adminToken = params?.token;
        let group = params?.group == 'false' ? false : true;

        if (params?.expiresAt) {
          let currentDate = moment();

          let expiresAt = moment(params?.expiresAt);

          let hoursDiff = expiresAt.diff(currentDate, 'hours');

          if (hoursDiff > 0 && hoursDiff <= 24) {
            callPeople(id, adminToken, group);
          } else {
            dispatch(setLinkExpired(true));
          }
        } else {
          dispatch(setLinkExpired(true));
        }
      },
    });

    async function callPeople(id, adminToken, group) {
      let data = {
        url: get_memory_share_users + `${id}/`,
        method: 'GET',
        token: userInfoToken,
      };
      try {
        let res = await getPeopleCall(data).unwrap();
        let emailFound;
        emailFound = res.shared_users_list.find(
          item => item.email == user_info?.email,
        );
        if (Boolean(emailFound)) {
          dispatch(setFirstTime(false));
          navigateToScreen(id);
        } else {
          dispatch(setLinkExpired(false));
          dispatch(setFirstTime(true));

          if (user_info) {
            addFriend(user_info?.email, id, adminToken, group);
          }
        }
      } catch (e) {}
    }

    return () => {
      if (_unsubscribeFromBranch) {
        _unsubscribeFromBranch();
        _unsubscribeFromBranch = null;
      }
    };
  }, [isFocused, user_info, isLogin]);

  return (
    // <NavigationContainer>
    <>{isLogin ? <LoggedInNavigator /> : <AuthNavigator />}</>
    // </NavigationContainer>
  );
};

export default App;
