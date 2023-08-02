import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Clipboard,
  FlatList,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

import moment from 'moment';
import branch from 'react-native-branch';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Button from '../../components/CustomButton';
import Text from '../../components/CustomText';
import DialogModal from '../../components/DialogModal';
import {LinkIcon} from '../../components/Icons/Icons';
import Header from '../../components/LoggedInHeader';
import PeopleCard from '../../components/PeopleCard';
import {get_memory_share_users} from '../../services/api-config';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {wp} from '../../util';
import createStyles from './styles';

const People = ({navigation, route}) => {
  const styles = useThemeAwareObject(createStyles);

  const [friendList, setFriendList] = useState([]);
  const email = useSelector(state => state.user?.userData?.email);
  const userInfoToken = useSelector(state => state.user.userData.tokens.access);
  const [getPeopleCall, getPeopleApiResponse] = usePostApiMutation();
  const [isFetching, setIsFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [page, setPage] = useState(1);
  const [isMorePeople, setIsMorePeople] = useState(false);

  const generateBranchUrl = async () => {
    let token = userInfoToken;

    let branchObject = await branch.createBranchUniversalObject('memoryoak/', {
      locallyIndex: true,

      contentMetadata: {
        customMetadata: {
          id: route.params.memory_id,
          token: token,
          group: 'false',
          expiresAt: moment().add(1, 'day').format(),
        },
      },

      contentDescription: 'This invite link expires in 24 hrs',
      contentImageUrl: route.params.memoryData?.cover_url ?? null,

      title: `Join ${route.params.memoryData?.title}`,
    });

    let shareUrl = await branchObject.generateShortUrl();

    setShareLink(shareUrl?.url);
    // let buo = await branch.createBranchUniversalObject('memoryoak/', {
    //   locallyIndex: true,
    //   contentMetadata: {
    //     customMetadata: {
    //       id: route.params.memory_id,
    //       token: token,
    //       group: 'false',
    //     },
    //   },

    //   contentDescription: 'You have been invited to be part of a memory',
    //   canonicalUrl:
    //     'https://static.wixstatic.com/media/298a38_a16ad203627249818bdffe11e2faf396~mv2_d_1920_1200_s_2.jpg/v1/fill/w_1920,h_1200,al_c/298a38_a16ad203627249818bdffe11e2faf396~mv2_d_1920_1200_s_2.jpg',
    //   title: 'MemoryOak Invite',
    // });
    // buo.logEvent(BranchEvent.ViewItem);

    // let {channel, completed, error} = await buo.showShareSheet(
    //   {
    //     emailSubject: 'MemoryOak ',
    //     messageBody: 'You have been invited to be a part of memory' + '.',
    //     messageHeader: 'MemoryOak',
    //   },

    //   {
    //     feature: 'share',
    //     channel: 'RNApp',
    //     id: route.params.memory_id,
    //     token: token,
    //   },
    //   {
    //     $ios_deepview: 'branch_default',
    //   },
    // );

    // if (error) {
    //   console.error('Error sharing via Branch: ' + error);
    //   return;
    // }
  };

  useEffect(() => {
    generateBranchUrl();
    getPeople();
  }, []);

  const getPeople = async page => {
    let data = {
      url: get_memory_share_users + `${route.params.memory_id}/`,
      method: 'GET',
      token: userInfoToken,
    };
    try {
      let getPeopleResponse = await getPeopleCall(data).unwrap();
      setFriendList(getPeopleResponse.shared_users_list);
      setIsFetching(false);
    } catch (e) {}
  };

  const renderPeople = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.email != email) {
            navigation.navigate('SharedMemories', {item: item});
          } else {
          }
        }}>
        <PeopleCard
          img={item.profile_pic_url}
          name={item.first_name + ' ' + item.middle_name}
        />
      </TouchableOpacity>
    );
  };

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        <Text style={styles.emptyMessageStyle}>No people available</Text>
      </View>
    );
  };
  const onRefresh = () => {
    getPeople();
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {getPeopleApiResponse.isLoading ? (
          <ActivityIndicator color="pink" style={{}} />
        ) : null}
      </View>
    );
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
        <Text style={styles.headerInitialText}>People</Text>
        <View style={{width: '15%'}}></View>
      </View>

      <FlatList
        data={friendList}
        renderItem={renderPeople}
        refreshing={getPeopleApiResponse.isLoading}
        onRefresh={onRefresh}
        keyExtractor={item => item.email}
        ListEmptyComponent={renderEmptyContainer}
        // ListFooterComponent={renderFooter}
        // onEndReached={() => {
        //   if (isMorePeople) {
        //     let tempPage = page + 1;
        //     setPage(tempPage);
        //     getPeople(tempPage);
        //   }
        // }}
      />

      <DialogModal
        visible={showModal}
        dialogStyle={styles.dialogStyle}
        onPress={() => setShowModal(false)}
        children={
          <>
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
              }}
              style={styles.modalCloseIcon}>
              <Ionicons
                name={'close-circle-outline'}
                size={styles.iconSize}
                color="grey"
              />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <Text style={styles.textFieldTile}>Share</Text>
            </View>
            <View>
              <Text style={styles.fieldText}>
                People can join this memory with the link below. (They need to
                have the MemoryOak App). {'\n'}
                This invite will expire in 24 hours.{'\n'}
              </Text>

              <View style={styles.inputContainerStyle}>
                <Text style={styles.saveChangesButtonText}>
                  {shareLink == '' ? (
                    <ActivityIndicator color="pink" />
                  ) : (
                    shareLink
                  )}
                </Text>
              </View>

              <Button
                icon={<LinkIcon height={wp(6)} width={wp(6)} />}
                style={[styles.modalButton, styles.modalButtonText]}
                title1="Copy Invite"
                disabled={!shareLink}
                onPress={() => {
                  Clipboard.setString(shareLink);
                  ToastAndroid.show('Link Copied', ToastAndroid.SHORT);
                  setShowModal(false);
                  setShareLink('');
                }}
              />
            </View>
          </>
        }
        contentStyle={styles.contentStyle}
      />

      <Button
        style={[styles.invitePeopleButton, styles.invitePeopleButtonText]}
        title1="Invite People"
        onPress={() => {
          generateBranchUrl();
          setShowModal(true);
        }}
      />
    </View>
  );
};

export default People;
