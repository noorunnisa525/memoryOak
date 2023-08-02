import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  LogBox,
  ScrollView,
  SectionList,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Text from '../../components/CustomText';
import Header from '../../components/LoggedInHeader';
import NewMemoryCard from '../../components/NewMemoryCard';
import YearTab from '../../components/YearTab';
import {get_shared_memories, get_User} from '../../services/api-config';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {setRefresh} from '../../redux/slices/userSlice';
import {hp, wp} from '../../util';
import createStyles from './styles';

function SharedMemories({navigation, route}) {
  const styles = useThemeAwareObject(createStyles);
  const [profileModal, toggleModal] = useState(false);
  const [yearsArray, setYearsArray] = useState([]);
  const userInfoToken = useSelector(
    state => state?.user?.userData?.tokens?.access,
  );
  const [memories, setMemories] = useState();
  const [getNewMemoriesCall, getNewMmemoriesResponse] = usePostApiMutation();
  const [getMoreMmeoriesCall, getMoreMemoriesResponse] = usePostApiMutation();
  const [filterarr, setfilterarr] = useState([]);
  const [selectedList, setselectedList] = useState([]);
  const [year, setAYear] = useState();
  const [month, setMonth] = useState();
  const [arryear, setyear] = useState([]);
  const [lactiveyear, setlactiveyear] = useState(0);
  const [months, setMonths] = useState([]);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [yearItem, setYearitem] = React.useState();
  const email = useSelector(state => state?.user?.userData?.email);
  const [getUserCall, userResponse] = usePostApiMutation();
  const [searchArrayData, setSearchArrayData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const isFocused = useIsFocused();
  const [mediaCheck, setMediaCheck] = useState(false);
  const {item} = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    getUser();
    setMediaCheck(true);
  }, []);

  const getUser = async () => {
    let data = {
      url: get_User + `${email}/`,
      method: 'GET',
      token: userInfoToken,
    };
    try {
      let user = await getUserCall(data).unwrap();
      // dispatch(setUserByEmail(user));
      // setUri(user?.user_profile_pic),
    } catch (e) {}
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

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    getNewMmemories();
  }, []);

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
      url: get_shared_memories + `${item.email ?? item.created_by}/`,
      data: data,
      method: 'PATCH',
      token: userInfoToken,
    };

    try {
      let apigetMemoriesData = await getNewMemoriesCall(apiData).unwrap();

      setYearsArray(apigetMemoriesData.years);
      valueset(apigetMemoriesData.memories, apigetMemoriesData);
      setIsFetching(false);
      setMediaCheck(false);
      // dispatch(setSubscription(subscription));
      // navigation.navigate('MemoryDetails');.202
    } catch (e) {}
  };

  const getMoreMmemories = async (month, months, index) => {
    let year = yearsArray[selectedTab];
    let data = {
      year: year,
      month: month,
    };
    const apiData = {
      url: get_shared_memories + `${item.email}/`,
      data: data,
      method: 'PATCH',
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

  const NewMemoryRenderItem = (
    item,
    index,
    sectionIndex,
    month,
    visible,
    memoryArrayLength,
  ) => {
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
              onPress={() => {
                dispatch(setRefresh(true));
                navigation.navigate('MemoryDetails', {
                  item: item,
                  month: monthss[parseInt(month) - 1],
                  year,
                  id: item.id,
                  refresh: true,
                });
              }}
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
      <>
        <Text style={styles.sectionHeaderStyle}>
          {monthss[parseInt(section.title) - 1]}
        </Text>
      </>
    );
  };

  const onRefresh = () => {
    setIsFetching(true);
    getNewMmemories();
  };

  useEffect(() => {
    if (isFocused) {
      getNewMmemories();
    }
  }, [isFocused]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'light-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
      />
      <View style={styles.subContainer}>
        <View style={styles.subsubContainer}>
          <MaterialCommunityIcons
            name={'keyboard-backspace'}
            size={30}
            color={'black'}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerInitialText}>
              {item.user_name ?? item.first_name + ` ` + item.middle_name}
            </Text>
            <Text style={styles.headerDate}>Shared Memories</Text>
          </View>
          <View style={{width: '10%'}}></View>
        </View>
      </View>
      {mediaCheck ? (
        <Image
          style={{
            marginTop: hp(3),
            width: hp(51),
            height: wp(193),
            resizeMode: 'stretch',
            position: 'absolute',
            zIndex: 50,
          }}
          source={require('../../../assets/images/memoriesSkeleton.jpeg')}
        />
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
                      NewMemoryRenderItem(
                        item,
                        index,
                        indexNumber,
                        section.title,
                        section.visible,
                        section.data.length,
                      )
                    }
                    keyExtractor={(item, index) => index}
                    ListEmptyComponent={() => {
                      return <Text>No Mmeories found</Text>;
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
            yearItem={yearItem}
            setYearitem={setYearitem}
          />
        </>
      ) : (
        <ScrollView
          contentContainerStyle={styles.createContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          <View style={styles.memoryContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CreateMemory');
              }}>
              <Ionicons
                name={'add-circle'}
                size={50}
                color={styles.addMemoryIcon}
              />
            </TouchableOpacity>
            <Text style={styles.firstMemoryText}>Create Your First Memory</Text>
          </View>
        </ScrollView>
      )}

      {/* <Button
        style={[styles.newMemoryButton, styles.newMemoryButtonText]}
        title1="New Memory "
        onPress={() => navigation.navigate('CreateMemory')}
      /> */}
    </KeyboardAvoidingView>
  );
}

export default SharedMemories;
