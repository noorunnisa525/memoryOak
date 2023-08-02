import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import Button from '../../components/CustomButton';
import Text from '../../components/CustomText';
import DialogModal from '../../components/DialogModal';
import LoggedInHeader from '../../components/LoggedInHeader';
import ViewMmeoryCard from '../../components/ViewMmeoryCard';
import ViewMmeoryVideoCard from '../../components/ViewMmeoryVideoCard';
import {delete_media, get_media_list} from '../../services/api-config';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {wp} from '../../util';
import createStyles from './styles';

const ViewMemory = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const [showModal, toggleModal] = useState(false);
  const [curIndex, setCurIndex] = useState(0);
  const [memoryArray, setMemoryArray] = useState([]);
  const [showSavingModal, setShowSavingModal] = useState(false);
  const flatListRef = useRef(null);
  const [deleteMediaCall, setDeleteMediaResponse] = usePostApiMutation();
  const [getMediaListCall, getMediaListResponse] = usePostApiMutation();
  const windowHeight = Dimensions.get('window').height;
  const userInfoToken = useSelector(state => state.user.userData.tokens.access);
  const userEmail = useSelector(state => state.user.userData.email);

  const route = useRoute();
  const {mediaList, item, index, id, pageNo} = route.params;
  const [page, setPage] = useState(pageNo);
  const [isMoreMemories, setIsMoreMemories] = useState(true);

  // useEffect(() => {
  //   if (memoryArray?.length) {
  //     const cIndex = memoryArray.findIndex(element => element.id === item.id);
  //     setCurIndex(index);
  //     // if (flatListRef?.current && index != -1) {
  //     //   flatListRef?.current?.scrollToIndex({animated: true, index: index});
  //     // }
  //   }
  // }, [memoryArray]);

  useEffect(() => {
    if (mediaList?.length) {
      setMemoryArray(mediaList);
    }
  }, []);

  const getMediaList = async page => {
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

      setMemoryArray([...memoryArray, ...MediaList?.medias_list]);
    } catch (e) {}
  };

  const deleteMedia = async id => {
    let apiData = {
      url: delete_media + `${id}/`,
      method: 'DELETE',
      token: userInfoToken,
    };

    try {
      let deleteCommentsResponse = await deleteMediaCall(apiData).unwrap();
      // let filteredArray = mediaList.filter(item => item.id != id);
      // setMemoryArray(filteredArray);

      let removedData = memoryArray.filter(item => item.id != id);
      setMemoryArray(removedData);
      // toggleModal(false);

      if (removedData.length > 0) {
        const index = mediaList.findIndex(element => element.id === id);
        const newIndex = mediaList[index + 1] ? index + 1 : index - 1;

        if (flatListRef?.current) {
          flatListRef?.current?.scrollToIndex({
            animated: true,
            index: newIndex,
          });
        }
      }
      toggleModal(false);
      if (removedData.length == 0) {
        navigation.navigate('NewMemory');
      } // getMediaComments();
    } catch (e) {
      toggleModal(false);
    }
  };

  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        'Save remote Image',
        'Grant Me Permission to save Image',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } catch (err) {
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + err.message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  const handleDownload = async (url, type, extension) => {
    if (Platform.OS === 'android') {
      const granted = await getPermissionAndroid();
      if (!granted) {
        return;
      }
    }
    setShowSavingModal(true);
    let PictureDir = RNFetchBlob.fs.dirs.PictureDir;
    let date = new Date();
    RNFetchBlob.config({
      fileCache: true,
      // appendExt: 'png',
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          `/${type}` +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          extension,
        description: type,
      },
      // appendExt: extension.split('.').join(''),
    })
      .fetch('GET', url)
      .then(res => {
        CameraRoll.save(res.data)
          .then(() => {
            Alert.alert(
              '',
              'Saved Successfully',
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
          })
          .catch(err => {
            Alert.alert(
              '',
              'Failed to save: ' + err.message,
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
          })
          .finally(() => setShowSavingModal(false));
      })
      .catch(error => {
        setShowSavingModal(false);

        Alert.alert(
          '',
          'Failed to save: ' + error.message,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      });
  };

  const renderItems = ({item, index}) => {
    return (
      <View style={styles.itemWrapper}>
        {item?.thumbnail_url?.includes('.mp4') ? (
          <ViewMmeoryVideoCard
            index={index}
            url={item.url}
            isCreatedByCurrentUser={
              userEmail == item.created_by?.email ?? item.created_by
            }
            thumbnailUrl={item.thumbnail_url}
            commentsMmeory={() => {
              navigation.navigate('MediaComment', {
                item: item,
                mediaList: memoryArray,
              });
            }}
            deleteMemory={() => {
              toggleModal(item.id);
            }}
            downloadMmeory={() => {
              handleDownload(item?.url, 'video', item.extension);
            }}
          />
        ) : (
          <ViewMmeoryCard
            index={index}
            isCreatedByCurrentUser={
              userEmail == item.created_by?.email ?? item.created_by
            }
            thumbnailUrl={item.thumbnail_url}
            img={item?.url || item?.thumbnail_url}
            commentsMmeory={() => {
              navigation.navigate('MediaComment', {
                item: item,
                mediaList: memoryArray,
              });
            }}
            deleteMemory={() => {
              toggleModal(item.id);
            }}
            downloadMmeory={() => {
              handleDownload(
                item?.url || item?.thumbnail_url,
                'photo',
                item.extension,
              );
            }}
          />
        )}
      </View>
    );
  };

  const getItemLayout = (data, index) => {
    return {
      length: windowHeight,
      offset: windowHeight * index,
      index,
    };
  };

  return (
    <View style={styles.mainContainer}>
      <LoggedInHeader
        placement={'center'}
        barStyle={'light-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusbar={styles.headerStatusbar}
      />
      <View style={styles.iconHeaderContainer}>
        <MaterialCommunityIcons
          name={'keyboard-backspace'}
          size={wp(8)}
          color={'white'}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>

      <FlatList
        data={memoryArray.filter(item => !item?.extension?.includes('.mp4'))}
        initialScrollIndex={index}
        renderItem={renderItems}
        ref={flatListRef}
        keyExtractor={item => item.id}
        snapToAlignment="start"
        decelerationRate={'fast'}
        snapToInterval={Dimensions.get('window').height}
        getItemLayout={getItemLayout}
        contentContainerStyle={{flexGrow: 1}}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: curIndex || info.index,
              animated: false,
            });
          });
        }}
        extraData={memoryArray}
        // snapToAlignment="start"
        // decelerationRate={'normal'}
        // snapToInterval={windowHeight}
        onEndReached={() => {
          if (isMoreMemories) {
            let tempPage = page + 1;
            setPage(tempPage);
            getMediaList(tempPage);
          }
        }}
      />

      <DialogModal
        visible={showModal ? true : false}
        dialogStyle={styles.dialogStyle}
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
                onPress={() => {
                  toggleModal(false);
                }}
                color="grey"
              />
            </TouchableOpacity>
            <Text style={styles.textFieldTile}>Delete photo{'\n'}</Text>
            <Text style={styles.fieldText}>
              Are you sure about this? {'\n'}This media will be gone from
              {'\n'}MemoryOak and you won't{'\n'}
              get it back{'\n'}
            </Text>
            <Button
              style={[styles.modalButton, styles.modalButtonText]}
              title1="Delete Media"
              onPress={() => {
                deleteMedia(showModal);
              }}
            />
          </>
        }
        contentStyle={styles.contentStyle}
      />

      <DialogModal
        visible={showSavingModal}
        dialogStyle={styles.saveDialogStyle}
        onPress={() => {}}
        children={
          <View style={styles.modalContentContainer}>
            <Text style={styles.fieldText}>
              Downloading your file. Please wait..
            </Text>

            <ActivityIndicator size={'large'} color={'#d06ffe'} />
          </View>
        }
        contentStyle={styles.contentStyle}
      />
    </View>
  );
};

export default ViewMemory;
