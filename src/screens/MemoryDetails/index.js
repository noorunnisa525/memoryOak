import * as Progress from 'react-native-progress';

import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {memo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Clipboard,
  FlatList,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import branch, {BranchEvent} from 'react-native-branch';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/CustomButton';
import Text from '../../components/CustomText';
import DialogModal from '../../components/DialogModal';
import {
  CommentIcon,
  EditIcon,
  InviteIcon,
  LinkIcon,
  PeopleIcon,
} from '../../components/Icons/Icons';
import Header from '../../components/LoggedInHeader';
import MemoryDetailsVideoCard from '../../components/MemoryDetailsVideoCard';
import NewMemoryCard from '../../components/NewMemoryCard';
import {
  clearUser,
  logOut,
  setFirstTime,
  setRefresh,
  setTokenError,
} from '../../redux/slices/userSlice';
import {
  add_media,
  get_media_list,
  get_memory,
  get_memory_share_users,
} from '../../services/api-config';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {hp, wp} from '../../util';
import createStyles from './styles';

function MemoryDetails({navigation, route}) {
  const styles = useThemeAwareObject(createStyles);
  const dispatch = useDispatch();
  const userInfoToken = useSelector(state => state.user.userData.tokens.access);
  const subscriptionStatus = useSelector(
    state => state?.stripe?.subscriptionData,
  );
  const tokenError = useSelector(state => state?.user.tokenError);
  const refresh = useSelector(state => state.user.refreshDetail);
  const isFirstTime = useSelector(state => state.user.firstTime);
  const [getMediaListCall, getMediaListResponse] = usePostApiMutation();
  const [getPeopleCall, getPeopleResponse] = usePostApiMutation();
  const [addMediaCall, mediaCallResponse] = usePostApiMutation();
  const {item, month, year} = route.params;
  const [mediaList, setMediaList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [openPicker, togllePicker] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [memoryData, setMemoryData] = useState(null);
  const [getMemoryCall, getMemoryResponse] = usePostApiMutation();
  const [shareLink, setShareLink] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [page, setPage] = useState(1);
  const [peopleCount, setPeopleCount] = useState();
  const [isMoreMemories, setIsMoreMemories] = useState(false);
  const [cover, setCover] = useState();
  const isFocused = useIsFocused();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setIsFetching(true);
  //     getMemory(route.params?.id);

  //     return () => {};
  //   }, []),
  // );

  const googleSignOut = async () => {
    try {
      dispatch(logOut(false));
      dispatch(clearUser());
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

  useEffect(() => {
    getMemory(route.params?.id);
    getPeople();
    return () => {};
  }, [route.params?.id]);

  useEffect(() => {
    setShowLimitModal(false);
    if (isFocused && refresh) {
      getPeople();
      dispatch(setRefresh(false));
      getMemory(route.params?.id);
      setIsFetching(true);
    }
    return () => {};
  }, [isFocused]);

  useEffect(() => {
    setIsFetching(true);
  }, []);

  const getMemory = async id => {
    let data = {
      url: get_memory + `${id}/`,
      method: 'GET',
      token: userInfoToken,
    };
    try {
      let response = await getMemoryCall(data).unwrap();
      dispatch(setTokenError(false));
      setMemoryData(response);
      setCover(response?.cover_url);

      getMediaList(response, id, 1);
    } catch (e) {
      if (e.status == 401) {
        dispatch(setTokenError(true));
      }
    }
  };

  const onImagePicked = ImageOrVideo => {
    let mediaData = [];
    let tempArr = [];
    ImageOrVideo.map(value => {
      if (memoryData?.memory_limit) {
        if (parseInt(mediaData.length) < parseInt(memoryData?.memory_limit)) {
          tempArr.push(value);
          mediaData.push({
            filename: value.path,
            size: value.size,
          });
        }
      } else {
        tempArr.push(value);
        mediaData.push({
          filename: value.path,
          size: value.size,
        });
      }
    });
    if (mediaData.length > 0 && tempArr.length > 0) {
      addMedia(mediaData, tempArr);
    }
  };

  const getMediaList = async (memoryData, id, page) => {
    setIsMoreMemories(false);

    let data = {
      url: get_media_list + `${id}/` + `?page=${page}`,
      method: 'GET',
      token: userInfoToken,
    };

    try {
      let MediaList = await getMediaListCall(data).unwrap();

      if (MediaList?.medias_list && MediaList?.medias_list.length == 30) {
        setIsMoreMemories(true);
      }

      if (memoryData?.cover_url) {
        // setMediaList([memoryData, ...MediaList?.medias_list]);
        setMediaList([...MediaList?.medias_list]);
        setIsFetching(false);
      } else {
        if (page == 1) {
          setMediaList([...MediaList?.medias_list]);
          setIsFetching(false);
        } else if (page > 1) {
          setMediaList([...mediaList, ...MediaList?.medias_list]);
          setIsFetching(false);
        }
      }
    } catch (e) {
      setIsFetching(false);
    }
  };

  const addMedia = async (media, pickerArr) => {
    let data = {
      memory: item?.id,
      filedata: media,
    };

    let apiData = {
      url: add_media,
      data: data,
      method: 'POST',
      token: userInfoToken,
    };
    try {
      let addMediaResponse = await addMediaCall(apiData).unwrap();
      setCurrentUploadIndex(0);
      setTotalImages(0);
      uploadToS3(addMediaResponse.data, pickerArr);
      setShowUploadModal(true);
    } catch (e) {
      setIsFetching(false);
    }
  };

  const uploadToS3 = async (imageResponseData, file) => {
    setMediaList([]);

    setTotalImages(imageResponseData.length);
    imageResponseData?.map((input, index) => {
      let temp = [...file];

      let temp_value = {...temp[index]};
      var imageObject = {};
      imageObject['name'] = temp_value.path;
      imageObject['type'] = temp_value.mime;
      imageObject['uri'] = temp_value.path;

      const data = new FormData();
      data.append('key', input.file_bucket_path + input.filename);
      data.append('acl', 'private');
      data.append('Content-Type', temp_value.mime);
      data.append('AWSAccessKeyId', input.key);
      data.append('Policy', input.policy);
      data.append('filename', input.filename);
      data.append('Signature', input.signature);
      data.append('file', imageObject);
      let request = new XMLHttpRequest();

      request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
          var status = request.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            setShowUploadModal(false);
            setUploadProgress(0);
            getMemory(route.params?.id);
          } else {
            setShowUploadModal(false);
            setUploadProgress(0);
          }
        }
      };

      request.upload.addEventListener('progress', function (event) {
        if (event.lengthComputable) {
          var progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
          setCurrentUploadIndex(index);
        }
      });

      request.open(
        'POST',
        'https://rishabh-bucket-demo.s3-eu-west-1.amazonaws.com',
        true,
      );
      request.send(data);
    });
  };

  const memoryDetailRender = ({item, index}) => {
    return (
      <>
        {item?.extension?.includes('.mp4') ? (
          <MemoryDetailsVideoCard
            cardText={item.title ?? item?.created_by?.first_name}
            url={item.url}
            thumbnailUrl={item?.thumbnail_url}
            onPress={() => {
              navigation.navigate('ViewMemory', {
                item: item,
                mediaList: mediaList,
                index: index,
                id: route.params?.id,
                pageNo: page,
              });
            }}
            imgStyle={styles.memoryDetailsCard}
            imgText={styles.cardText}
            comment={item.media_comments > 0 && item.media_comments}
          />
        ) : (
          <NewMemoryCard
            cardText={item.title ?? item?.created_by?.first_name}
            img={item?.thumbnail_url}
            onPress={() => {
              navigation.navigate('ViewMemory', {
                item: item,
                mediaList: mediaList,
                index: index,
                id: route.params?.id,
                pageNo: page,
              });
            }}
            imgStyle={styles.memoryDetailsCard}
            imgText={styles.cardText}
            comment={item.media_comments > 0 && item.media_comments}
          />
        )}
      </>
    );
  };

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        <Text style={styles.emptyMessageStyle}>The list is empty</Text>
      </View>
    );
  };

  const onRefresh = () => {
    setIsFetching(true);
    setPage(1);
    getMediaList(memoryData, route.params?.id, 1);
    getMemory(route.params?.id);
    getPeople();
  };

  const getPeople = async () => {
    let data = {
      url: get_memory_share_users + `${item.id}/`,
      method: 'GET',
      token: userInfoToken,
    };
    try {
      let res = await getPeopleCall(data).unwrap();
      setPeopleCount(res.count);
    } catch (e) {}
  };

  const generateBranchUrl = async () => {
    setShareLink();
    let token = userInfoToken;
    let branchObject = null;
    branchObject = await branch.createBranchUniversalObject('memoryoak/', {
      locallyIndex: false,

      contentMetadata: {
        customMetadata: {
          id: item.id,
          token: token,
          group: 'false',
          expiresAt: moment().add(1, 'day').format(),
        },
      },

      contentDescription: 'This invite link expires in 24 hrs',
      contentImageUrl: memoryData?.cover_url ?? null,

      title: `Join ${memoryData?.title}`,
    });

    let shareUrl = await branchObject.generateShortUrl();

    setShareLink(shareUrl?.url);
    await branchObject.release();

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

  const onShare = async () => {
    let buo = await branch.createBranchUniversalObject('memoryoak/', {
      locallyIndex: true,
      contentMetadata: {
        customMetadata: {
          id: item.id,
          token: userInfoToken,
          // group: 'true',
        },
      },

      contentDescription: 'You have been invited to be part of a group memory',
      canonicalUrl:
        'https://static.wixstatic.com/media/298a38_a16ad203627249818bdffe11e2faf396~mv2_d_1920_1200_s_2.jpg/v1/fill/w_1920,h_1200,al_c/298a38_a16ad203627249818bdffe11e2faf396~mv2_d_1920_1200_s_2.jpg',
      title: 'MemoryOak Invite',
    });
    buo.logEvent(BranchEvent.ViewItem);

    let {channel, completed, error} = await buo.showShareSheet(
      {
        emailSubject: 'MemoryOak ',
        messageBody: 'You have been invited to be a part of memory' + '.',
        messageHeader: 'MemoryOak',
      },

      {
        feature: 'share',
        channel: 'RNApp',
        id: item.id,
        token: userInfoToken,
      },
      {
        $ios_deepview: 'branch_default',
      },
    );

    if (error) {
      return;
    }
  };

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        {/* <Text style={styles.btnText}>Load More</Text> */}
        {getMediaListResponse.isLoading ? (
          <ActivityIndicator color="pink" style={{}} />
        ) : null}
      </View>
    );
  };

  const handlePicker = () => {
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      cropping: false,
      maxFiles: 200,

      // mediaType: 'any',
      mediaType: 'photo',
      multiple: true,
    })
      .then(image => {
        onImagePicked(image);
      })
      .catch(e => console.log(e, 'error'))
      .finally(() => {
        // togllePicker(false);
        // setMediaOpen(false);
      });
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
            <Text style={styles.headerInitialText}>{memoryData?.title}</Text>
            <Text style={styles.headerDate}>
              {memoryData?.date &&
                moment(memoryData?.date).format('DD MMMM, YYYY')}
            </Text>
          </View>
          <View style={{width: '10%'}}></View>
        </View>
      </View>

      {/* {isFetching ? (
        <ActivityIndicator
          size={'small'}
          color={'pink'}
          style={{marginTop: hp(10)}}
        />
      ) : ( */}
      <FlatList
        style={styles.flatListStyle}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={styles.container}
        numColumns={2}
        ListHeaderComponent={() => (
          <View style={styles.memoryContainer}>
            <View style={styles.buttonContainer}>
              <Button
                style={[styles.socialButton, styles.socialText]}
                title1="Edit"
                icon={<EditIcon height={wp(6)} width={wp(6)} />}
                // iconColor={'black'}
                onPress={() => navigation.navigate('EditMemory', {item: item})}
              />
              <Button
                style={[styles.socialButton, styles.socialText]}
                title1="Share"
                icon={<InviteIcon height={wp(6)} width={wp(6)} />}
                // iconColor={'black'}
                onPress={() => {
                  generateBranchUrl();
                  setShowModal(true);
                }}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                style={[styles.socialButton, styles.socialText]}
                title1="People"
                icon={
                  <View style={peopleCount > 1 && styles.commentIcon}>
                    <PeopleIcon height={wp(6)} width={wp(6)} />
                    {peopleCount > 1 && <Text>{peopleCount}</Text>}
                  </View>
                }
                // iconColor={'black'}
                onPress={() =>
                  navigation.navigate('People', {
                    memory_id: item.id,
                    memoryData: memoryData,
                  })
                }
              />
              <Button
                style={[styles.socialButton, styles.socialText]}
                title1="Comments"
                icon={
                  <View
                    style={
                      memoryData?.total_comments > 0 && styles.commentIcon
                    }>
                    <CommentIcon height={wp(6)} width={wp(6)} />
                    {memoryData?.total_comments > 0 && (
                      <Text>{memoryData?.total_comments}</Text>
                    )}
                  </View>
                }
                // iconColor={'black'}
                onPress={() => navigation.navigate('Comment', {item: item})}
              />
            </View>
          </View>
        )}
        data={mediaList.filter(item => !item?.extension?.includes('.mp4'))}
        renderItem={memoryDetailRender}
        keyExtractor={(item, index) => item.id}
        // ListEmptyComponent={renderEmptyContainer}
        refreshing={false}
        onRefresh={onRefresh}
        extraData={mediaList}
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (isMoreMemories) {
            let tempPage = page + 1;
            setPage(tempPage);
            getMediaList(null, route.params?.id, tempPage);
          }
        }}
      />
      {/* )} */}

      {!isFetching && (
        <Button
          style={[styles.newMemoryButton, styles.newMemoryButtonText]}
          title1="Add Photos "
          onPress={() => {
            if (memoryData?.memory_limit || memoryData?.memory_limit == null) {
              handlePicker();
            } else {
              setShowLimitModal(true);
            }
          }}
        />
      )}

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
                disabled={!shareLink}
                icon={<LinkIcon height={wp(6)} width={wp(6)} />}
                style={[styles.modalButton, styles.modalButtonText]}
                title1="Copy link"
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

      {/* {openPicker && (
        <ImageCropPicker
          onChange={onImagePicked}
          mediaType={true}
          multipleMedia={true}
          mediaOpen={mediaOpen}
          setMediaOpen={setMediaOpen}
        />
      )} */}

      <DialogModal
        visible={showUploadModal}
        dialogStyle={styles.progressDialogStyle}
        onPress={() => {}}
        children={
          <View style={styles.modalContentContainer}>
            <Text style={styles.uploadingText}>
              We are adding your photos. Please wait and do not close the app.
            </Text>
            <Progress.Bar
              progress={uploadProgress}
              height={hp(2)}
              width={wp(80)}
              borderRadius={hp(3)}
              color={'#d06ffe'}
              style={styles.progressBarStyle}
            />
            <Text style={styles.uploadingText}>
              Thanks for choosing an ethical network
            </Text>
          </View>
        }
        contentStyle={styles.contentStyle}
      />
      <DialogModal
        visible={isFirstTime}
        dialogStyle={styles.happyModal}
        children={
          <View>
            <View style={styles.rowContainer}>
              <Text style={styles.modalHeader}>Happy Days!</Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setFirstTime(false));
                }}
                style={styles.modalCloseIcon}>
                <Ionicons
                  name={'close-circle-outline'}
                  size={40}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Welcome to our {memoryData?.title} memory.
            </Text>
            <Text style={styles.modalText}>
              Thanks for choosing an ethical network.
            </Text>
          </View>
        }
      />

      <DialogModal
        visible={showLimitModal}
        dialogStyle={styles.happyModal}
        children={
          <View>
            <View style={styles.rowContainer}>
              <Text style={styles.modalHeader}>Limit Reached!</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowLimitModal(false);
                }}
                style={styles.modalCloseIcon}>
                <Ionicons
                  name={'close-circle-outline'}
                  size={40}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              You cannot upload more than 10 photos per memory since you are not
              a member.
            </Text>
            <Button
              style={[styles.buyBtn, styles.buyText]}
              title1="Get Membership"
              onPress={() => navigation.navigate('MemberShip')}
            />
          </View>
        }
      />
    </View>
  );
}

export default MemoryDetails;
