import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  FlatList,
  Image,
  ScrollView,
  SectionList,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '../../components/CustomAvatar';
import Button from '../../components/CustomButton';
import Text from '../../components/CustomText';
import DialogModal from '../../components/DialogModal';
import Header from '../../components/LoggedInHeader';
import NewMemoryCard from '../../components/NewMemoryCard';
import SearchBar from '../../components/SearchBar';
import SearchingCard from '../../components/SearchingCard';
import YearTab from '../../components/YearTab';
import {
  clearSubscription,
  setSubscription,
} from '../../redux/slices/stripeSlice';
import {
  clearUser,
  logOut,
  setLinkExpired,
  setTokenError,
  setUserByEmail,
} from '../../redux/slices/userSlice';
import {
  check_plan,
  get_new_memories,
  get_User,
} from '../../services/api-config';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {isAndroid, wp} from '../../util';
import createStyles from './styles';
import useInAppPurchase from '../../hooks/useInAppPurchase';

function NewMemory({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [profileModal, toggleModal] = useState(false);
  const [yearsArray, setYearsArray] = useState([]);
  const userInfoToken = useSelector(
    state => state?.user?.userData?.tokens?.access,
  );
  const subscriptionStatus = useSelector(
    state => state?.stripe?.subscriptionData,
  );
  const tokenError = useSelector(state => state?.user.tokenError);
  const linkExpired = useSelector(state => state?.user.linkExpired);
  const isFocused = useIsFocused();

  const [memories, setMemories] = useState();
  const [getNewMemoriesCall, getNewMmemoriesResponse] = usePostApiMutation();
  const [getMoreMmeoriesCall, getMoreMemoriesResponse] = usePostApiMutation();
  const [getUserCall, userResponse] = usePostApiMutation();
  const [getActiveCall, activeCallResponse] = usePostApiMutation();
  const [filterarr, setfilterarr] = useState([]);
  const [selectedList, setselectedList] = useState([]);
  const [year, setAYear] = useState();
  const [month, setMonth] = useState();
  const [arryear, setyear] = useState([]);
  const [lactiveyear, setlactiveyear] = useState(0);
  const [months, setMonths] = useState([]);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [yearItem, setYearitem] = React.useState();
  const [searching, setSearching] = useState('');
  const [avatar, setAvatar] = useState('');
  const email = useSelector(state => state?.user?.userData?.email);
  const [searchArrayData, setSearchArrayData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [mediaCheck, setMediaCheck] = useState(false);
  const {connected, availablePurchases, handleAvailable, purchases} =
    useInAppPurchase();
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (isFocused) {
      checkActivePlan();
    }
    handleAvailable();
  }, [isFocused]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // checkPurchase();
        handleAvailable();
        checkActivePlan();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkActivePlan = async () => {
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
  // const checkPurchase = () => {
  //   if (availablePurchases.length > 0) {
  //     dispatch(setSubscription(true));
  //   } else {
  //     dispatch(setSubscription(false));
  //   }
  // };

  const googleSignOut = async () => {
    try {
      clearState();
      dispatch(logOut(false));
      dispatch(clearUser());
      dispatch(clearSubscription());
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      googleSignOut();
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async () => {
    let data = {
      url: get_User + `${email}/`,
      method: 'GET',
      token: userInfoToken,
    };
    try {
      let user = await getUserCall(data).unwrap();
      dispatch(setUserByEmail(user));
      // dispatch(setSubscription(user.is_premium));
      setAvatar(user?.profile_pic_url);
    } catch (e) {}
  };
  const onChangeText = text => {
    setSearching(text);
    const list = selectedList?.filter(val => {});
  };
  const monthss = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const [sectionDataLength, setSectionDataLength] = React.useState();

  const onRefresh = () => {
    setIsFetching(true);
    getNewMmemories();
  };

  useFocusEffect(
    React.useCallback(() => {
      setMediaCheck(true);
      getUser();
      getNewMmemories();
      return () => {};
    }, []),
  );

  useEffect(() => {
    if (filterarr && filterarr.length) {
      let sections = filterarr[selectedTab]?.arr;
      sections = sections.map((item, index) => ({
        title: item.month,
        data: item.memory,
        index: index,
        visible: false,
      }));
      setselectedList(sections);
      setIsFetching(false);
    }
  }, [filterarr, selectedTab]);

  const clearState = () => {
    toggleModal(!profileModal);
  };

  const getNewMmemories = async () => {
    let data = {
      year: '_',
      month: '_',
    };
    const apiData = {
      url: get_new_memories,
      data: data,
      method: 'POST',
      token: userInfoToken,
    };
    try {
      let apigetMemoriesData = await getNewMemoriesCall(apiData).unwrap();
      dispatch(setTokenError(false));
      setYearsArray(apigetMemoriesData.years);
      valueset(apigetMemoriesData.memories, apigetMemoriesData);
      setIsFetching(false);
      setMediaCheck(false);
    } catch (e) {
      if (e.status == 401) {
        dispatch(setTokenError(true));
      }
    }
  };

  const getMoreMmemories = async (month, months, index) => {
    let year = yearsArray[selectedTab];
    let data = {
      year: year,
      month: month,
    };
    const apiData = {
      url: get_new_memories,
      data: data,
      method: 'POST',
      token: userInfoToken,
    };
    try {
      let apiGetMoreMmeoriesData = await getMoreMmeoriesCall(apiData).unwrap();
      setIsFetching(true);
      let temp = memories;

      let cmonth = temp[year][month];
      cmonth = apiGetMoreMmeoriesData?.memories;
      // temp[year][month] = cmonth;
      setMemories(temp);
      setMonths(months);
      setAYear(year);
      let temp1 = selectedList;
      temp1.map(item => {
        if (item.title == month) {
          item.data = cmonth;
          item.visible = true;
        }
      });
      setselectedList([...temp1]);
      setIsFetching(false);
    } catch (e) {}
  };

  const valueset = async (value, combineValue) => {
    let newarrFilter = [];
    setMemories(value);
    let empty = [];
    let temp = Object.keys(value);
    temp = temp.reverse();
    let temparr = temp.map((input, index) =>
      empty.push({isActive: index == 0 ? true : false, year: input}),
    );
    setyear(empty);
    setlactiveyear(0);

    let tempmonth = [];

    Object.keys(value[empty[0].year]).map(
      input => input?.length <= 2 && tempmonth.push(input),
    );

    setMonths(tempmonth);
    setAYear(yearsArray[selectedTab]);

    combineValue.years.map((year, yearIndex) => {
      let cmonth = [];
      let montharr = Object.keys(combineValue.memories[year.toString()]);
      montharr.map(month => {
        if (month?.length <= 2) {
          cmonth.push(month);
        }
      });

      cmonth = cmonth.reverse();

      cmonth.map((input, index) => {
        if (index < 1) {
          newarrFilter.push({
            year: year,
            arr: [{month: input, memory: combineValue.memories[year][input]}],
          });
        } else {
          newarrFilter[yearIndex].arr = [
            ...newarrFilter[yearIndex].arr,
            {month: input, memory: combineValue.memories[year][input]},
          ];
        }
      });
    });

    setfilterarr(newarrFilter);
  };

  const renderMemories = (item, index, sectionIndex, month, visible) => {
    if (index > 3 && !visible) {
      return null;
    }
    let tmonth = month + '_count';

    let tmonthcount = memories[yearsArray[selectedTab]][tmonth];
    tmonthcount = tmonthcount > 4 ? tmonthcount - 3 : tmonthcount;

    return (
      <>
        <TouchableOpacity
          onPress={() => {
            if (index == 3 && !visible) {
              // setvisible(true);
              return;
            }
            if (index < 3 || (visible && index > 2)) {
              navigation.navigate('MemoryDetails', {
                item: item,
                month: monthss[parseInt(month) - 1],
                year,
              });
            }
          }}>
          {index < 3 || (visible && index == 3) || (index > 3 && visible) ? (
            <NewMemoryCard
              cardText={item.title}
              img={item?.thumbnail_url}
              imgStyle={styles.memoryDetailsCard}
              imgText={styles.cardText}
              onPress={() =>
                navigation.navigate('MemoryDetails', {
                  item: item,
                  month: monthss[parseInt(month) - 1],
                  year,
                  id: item.id,
                })
              }
            />
          ) : index >= 3 && !visible ? (
            <>
              <NewMemoryCard
                cardText={tmonthcount == 4 ? item.title : null}
                img={item?.thumbnail_url}
                imgStyle={styles.memoryDetailsCard}
                imgText={styles.cardText}
                // onPress={() =>
                //   navigation.navigate('MemoryDetails', {
                //     item: item,
                //     searchArrayData: searchArrayData,
                //   })
                // }
              />
              <TouchableOpacity
                style={styles.overlay}
                onPress={() =>
                  getMoreMmemories(month, months, sectionIndex, visible)
                }>
                <Text style={styles.moreText}>
                  {tmonthcount == 4 ? null : tmonthcount}
                  {tmonthcount == 4 ? null : '\nMore'}
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
        </TouchableOpacity>
      </>
    );
  };

  const NewMemorySectionHeader = ({section}) => {
    setMonth(section.title);
    return (
      <Text style={styles.sectionHeaderStyle}>
        {monthss[parseInt(section.title) - 1]}
      </Text>
    );
  };

  const searchingRenderItem = (item, index) => {
    return (
      <SearchingCard
        year={item.year}
        cardText={item.title}
        month={item.month}
        img={
          item
            ? item?.thumbnail_url
            : 'https://image.shutterstock.com/image-illustration/black-solid-dark-night-260nw-1939034020.jpg'
        }
        onPress={() =>
          navigation.navigate('MemoryDetails', {
            item: item,
            searchArrayData: searchArrayData,
            id: item.id,
          })
        }
      />
    );
  };

  useEffect(() => {
    if (searching || filterarr.length) {
      let data = [];
      filterarr.forEach(item => {
        item.arr.forEach(el => {
          el.memory.forEach(mem => {
            data.push({
              year: item.year,
              month: monthss[parseInt(el.month) - 1],
              ...mem,
            });
          });
        });
      });
      data = data.filter(d =>
        d.title.toLowerCase().includes(searching.toLowerCase()),
      );
      setSearchArrayData(data);
      setIsFetching(false);
    }
  }, [searching, filterarr]);

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        <Text style={styles.emptyText}>No Memories found</Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.mainContainer}>
        {mediaCheck || activeCallResponse.isLoading ? (
          <>
            <Header backgroundColor={styles.headerColor} />
            <Image
              style={{
                width: wp(100),
                flex: 1,
                resizeMode: 'stretch',
              }}
              source={require('../../../assets/images/memoriesSkeleton.jpeg')}
            />
          </>
        ) : (
          <>
            <Header
              placement={'center'}
              barStyle={'light-content'}
              containerStyle={styles.headerContainerStyle}
              backgroundColor={styles.headerColor}
            />
            <View style={styles.subContainer}>
              <Text style={styles.headerInitialText}>
                Memory <Text style={styles.headerLastText}>Oak</Text>
              </Text>
              <Avatar
                rounded
                image={avatar}
                size="medium"
                avatarContainer={styles.avatarImage}
                onPressAvatar={() => {
                  toggleModal(true);
                }}
              />
            </View>

            <SearchBar
              placeholder="Search your memories"
              value={searching}
              onChangeText={onChangeText}
            />

            {searching ? (
              <View style={styles.container}>
                <FlatList
                  numColumns={1}
                  showsVerticalScrollIndicator={false}
                  data={searchArrayData}
                  refreshing={isFetching}
                  onRefresh={onRefresh}
                  progressViewOffset={100}
                  renderItem={({item, index}) =>
                    searchingRenderItem(item, index)
                  }
                  keyExtractor={(item, index) => index}
                  ListEmptyComponent={renderEmptyContainer}
                />
              </View>
            ) : filterarr.length ? (
              <>
                <ScrollView
                  contentContainerStyle={styles.memoriesContainer}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="always">
                  <SectionList
                    sections={selectedList}
                    renderSectionHeader={NewMemorySectionHeader}
                    ListEmptyComponent={() => {
                      return (
                        <View style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>
                            No Memories found
                          </Text>
                        </View>
                      );
                    }}
                    refreshing={isFetching}
                    onRefresh={onRefresh}
                    renderItem={({section, index}) => {
                      let indexNumber = index;
                      if (index !== 0) return null;
                      setSectionDataLength(section.data.length);
                      return (
                        <FlatList
                          numColumns={2}
                          data={section.data}
                          renderItem={({item, index}) =>
                            renderMemories(
                              item,
                              index,
                              indexNumber,
                              section.title,
                              section.visible,
                            )
                          }
                          keyExtractor={(item, index) => item.id}
                          ListEmptyComponent={() => {
                            return (
                              <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                  No Memories found
                                </Text>
                              </View>
                            );
                          }}
                        />
                      );
                    }}
                  />
                </ScrollView>
                <YearTab
                  years={yearsArray}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />
              </>
            ) : null}

            <DialogModal
              visible={profileModal}
              dialogStyle={styles.dialogStyle}
              contentStyle={styles.contentStyle}
              onPress={() => toggleModal(false)}
              children={
                <>
                  <TouchableOpacity
                    onPress={() => {
                      toggleModal(false);
                    }}
                    style={styles.modalCloseIcon}>
                    <Ionicons
                      name={'close-circle-outline'}
                      size={40}
                      color="grey"
                    />
                  </TouchableOpacity>
                  <View style={styles.modalContentContainer}>
                    <Avatar
                      rounded
                      image={avatar}
                      size="large"
                      avatarContainer={styles.profileImage}
                      disabled={true}
                      // onPressAvatar={() => {
                      //   toggleModal(true);
                      // }}
                    />
                    <Button
                      style={[styles.profileButton, styles.newMemoryButtonText]}
                      title1="Edit Account "
                      onPress={() => {
                        navigation.navigate('EditProfileScreen'), clearState();
                      }}
                    />
                    <Button
                      style={[styles.profileButton, styles.newMemoryButtonText]}
                      title1="Membership"
                      onPress={() => {
                        navigation.navigate('MemberShip'), clearState();
                      }}
                    />
                    <Button
                      style={[styles.profileButton, styles.newMemoryButtonText]}
                      title1="Logout"
                      onPress={signOut}
                    />
                  </View>
                </>
              }
            />
          </>
        )}
      </View>

      {tokenError && (
        <DialogModal
          visible={tokenError}
          contentStyle={styles.contentStyle}
          dialogStyle={styles.logoutModalStyle}
          children={
            <>
              <View>
                <Text style={styles.expiryText}>Your token has expired</Text>
                <Text style={styles.expiryText}>Please login again!</Text>
                <Button
                  style={[styles.expireButton, styles.expireBtnText]}
                  title1="OK"
                  onPress={signOut}
                />
              </View>
            </>
          }
        />
      )}

      {linkExpired && (
        <DialogModal
          visible={linkExpired}
          contentStyle={styles.contentStyle}
          dialogStyle={styles.logoutModalStyle}
          children={
            <>
              <Text style={styles.expiryText}>
                This invitation has expired.{'\n'}
              </Text>
              <Text style={styles.expiryText}>
                Please ask someone in the memory to send you a new invite.
              </Text>
              <Button
                style={[styles.expireButton, styles.expireBtnText]}
                title1="OK"
                onPress={() => {
                  navigation.reset({
                    index: 1,
                    routes: [{name: 'NewMemory'}],
                  });
                  dispatch(setLinkExpired(false));
                }}
              />
            </>
          }
        />
      )}

      {mediaCheck || activeCallResponse.isLoading ? null : (
        <Button
          style={[styles.newMemoryButton, styles.newMemoryButtonText]}
          title1={'New Memory'}
          onPress={() => navigation.navigate('CreateMemory')}
          // title1={subscriptionStatus ? 'New Memory' : 'Become a Member'}
          // onPress={() =>
          //   subscriptionStatus
          //     ? navigation.navigate('CreateMemory')
          //     : navigation.navigate('MemberShip')
          // }
        />
      )}
    </>
  );
}

export default NewMemory;
