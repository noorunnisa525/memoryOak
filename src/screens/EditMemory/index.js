import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Button from '../../components/CustomButton';
import DateTimePicker from '../../components/CustomDatePicker';
import CustomInputField from '../../components/CustomInputField';
import Text from '../../components/CustomText';
import DialogModal from '../../components/DialogModal';
import {LogoutIcon} from '../../components/Icons/Icons';
import Header from '../../components/LoggedInHeader';
import {
  edit_memory,
  get_memory,
  leave_memory,
  memory_cover_photo,
} from '../../services/api-config';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {hp, wp} from '../../util';
import createStyles from './styles';

function EditMemory({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [date, setDate] = useState();
  const route = useRoute();
  const {item} = route.params;
  const [uri, setUri] = useState('');
  const [editMmemoryTitle, setEditMmemoryTitle] = useState('');
  const email = useSelector(state => state.user.userData.email);
  const [titleError, setTitleError] = useState('');
  const [memoryPic, setMmeoryPic] = useState();
  const [memoryPicSize, setMmeoryPicSize] = useState();
  const [imageResponse, setResponse] = useState();
  const [coverPhoto, setCoverPhoto] = useState();
  const userInfoToken = useSelector(state => state.user.userData.tokens.access);
  const [editMemoryCall, setEditMemoryResponse] = usePostApiMutation();
  const [editMemoryPicCall, edirMemoryPicResponse] = usePostApiMutation();
  const [mediaOpen, setMediaOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [onPressAvatar, toggleAvatar] = useState(false);
  const [getMemoryCall, getMemoryResponse] = usePostApiMutation();
  const [leaveModal, setLeaveModal] = useState(false);
  const [leaveMemoryCall, leaveMemoryResponse] = usePostApiMutation();

  useEffect(() => {
    getMemory();
  }, []);

  const getMemory = async () => {
    let data = {
      url: get_memory + `${item.id}/`,
      method: 'GET',
      token: userInfoToken,
    };
    try {
      let response = await getMemoryCall(data).unwrap();
      setDate(moment(response.date));
      setEditMmemoryTitle(response.title);
      setUri(response?.thumbnail_url);
    } catch (e) {}
  };

  const handlePicker = () => {
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      cropping: false,
      maxFiles: 200,

      // mediaType: 'any',
      mediaType: 'photo',
      multiple: false,
    })
      .then(image => {
        onChange(image);
      })
      .catch(e => console.log(e, 'error'))
      .finally(() => {
        // togllePicker(false);
        // setMediaOpen(false);
      });
  };

  const onChange = ImageOrVideo => {
    setResponse(ImageOrVideo);
    toggleAvatar(true);
    const {path} = ImageOrVideo;
    let urlDecoded = decodeURIComponent(path);
    urlDecoded = urlDecoded.replace('file://', '');
    setMmeoryPic(urlDecoded);
    setUri(ImageOrVideo.path);
    setMmeoryPicSize(ImageOrVideo.size);
  };

  const handleError = () => {
    setTitleError('');
    if (editMmemoryTitle == '') {
      setTitleError('Title must not be empty*');
    } else {
      editMemory();
    }
  };

  const onSubmit = date => {
    handleError();
  };

  const editMemory = async () => {
    let data = {
      title: editMmemoryTitle,
      date: moment(date).format('YYYY-MM-DDTHH:mm:ss.000Z'),
      description: '',
      shared_users: [email],
    };
    let apiData = {
      url: edit_memory + `${item.id}/`,
      data: data,
      method: 'PATCH',
      token: userInfoToken,
    };
    try {
      let editMemoryApiResponse = await editMemoryCall(apiData).unwrap();

      if (onPressAvatar) {
        editMemoryCover(editMemoryApiResponse?.id);
      } else {
        navigation.goBack();
      }
    } catch (e) {}
  };

  const editMemoryCover = async id => {
    toggleAvatar(false);
    let data = {
      filename: memoryPic,
      size: memoryPicSize,
      memory: id,
    };
    let apiData = {
      url: memory_cover_photo,
      data: data,
      method: 'POST',
      token: userInfoToken,
    };
    try {
      let editMmeoryCoverApi = await editMemoryPicCall(apiData).unwrap();
      setShowUploadModal(true);
      uploadToS3(editMmeoryCoverApi.data, editMmeoryCoverApi);
    } catch (e) {}
  };

  const uploadToS3 = async (dataa, response) => {
    let imageObject = {};
    const newImageUri =
      'file:/' + imageResponse.path.split('file:///').join('');
    imageObject['uri'] = imageResponse.path;
    imageObject['type'] = imageResponse.mime;
    imageObject['name'] = newImageUri.split('/').pop();
    var contentType =
      imageResponse.mime != ''
        ? imageResponse.mime
        : 'application/octet-stream';
    const data = new FormData();
    data.append('key', dataa.file_bucket_path + dataa.filename);
    data.append('acl', 'private');
    data.append('Content-Type', contentType);
    data.append('AWSAccessKeyId', dataa.key);
    data.append('Policy', dataa.policy);
    data.append('filename', dataa.filename);
    data.append('Signature', dataa.signature);
    data.append('file', imageObject);
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        var status = request.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          setShowUploadModal(false);
          setUploadProgress(0);
          navigation.goBack();
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
      }
    });

    request.open(
      'POST',
      'https://rishabh-bucket-demo.s3-eu-west-1.amazonaws.com',
      true,
    );
    request.send(data);
  };

  const leaveMemory = async () => {
    let apiData = {
      url: leave_memory + `${item.id}/`,
      method: 'PATCH',
      token: userInfoToken,
    };
    try {
      let res = await leaveMemoryCall(apiData).unwrap();
      setLeaveModal(false);
      navigation.reset({
        index: 1,
        routes: [{name: 'NewMemory'}],
      });
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
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerInitialText}>Edit Memory</Text>
        <Button
          style={[null, null]}
          icon={<LogoutIcon height={wp(6)} width={wp(6)} />}
          onPress={() => setLeaveModal(true)}
        />
      </View>

      {getMemoryResponse.isLoading ? (
        <ActivityIndicator
          size={'large'}
          color={styles.activityColor.color}
          style={styles.activityStyle}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="always">
          <Avatar
            source={
              uri
                ? {uri: uri}
                : require('../../../assets/images/Memory_Default_thumbnail.jpg')
            }
            containerStyle={{
              height: hp(15),
              width: hp(15),
            }}
            avatarStyle={{
              borderRadius: hp(15),
            }}
            // size={hp(15)}
            onPress={handlePicker}>
            <Avatar.Accessory
              onPress={handlePicker}
              height={styles.avatarAccessory.height}
              width={styles.avatarAccessory.width}
              size={styles.avatarAccessory.size}
              color={styles.avatarAccessory.color}
              backgroundColor={styles.avatarAccessory.backgroundColor}
              borderRadius={styles.avatarAccessory.borderRadius}
              style={styles.avatarAccessoryContainer}
            />
          </Avatar>
          {/* <ImageCropPicker
            onChange={onChange}
            source={avatar}
            uri={uri}
            avatar={require('../../../assets/images/Memory_Default_thumbnail.jpg')}
            profile={true}
            coverPhoto={coverPhoto}
            setCoverPhoto={setCoverPhoto}
            setMmeoryPic={setMmeoryPic}
            setMmeoryPicSize={setMmeoryPicSize}
            setResponse={setResponse}
            mediaType={true}
            setMediaOpen={setMediaOpen}
            camera={true}
          /> */}

          <View style={styles.memoryContainer}>
            <Text style={styles.textFieldTile}>Title</Text>
            <CustomInputField
              placeholder={'Enter memory title'}
              numberOfLines={1}
              maxLength={25}
              value={editMmemoryTitle}
              inputContainerStyle={{borderColor: 'lightgray'}}
              onChangeText={text => setEditMmemoryTitle(text)}
            />
            {editMmemoryTitle == '' && (
              <Text style={styles.textFieldError}>{titleError}</Text>
            )}
            <Text style={styles.textFieldTile}>Date</Text>
            <DateTimePicker value={date} type="date" setCurrentDate={setDate} />
          </View>

          <Button
            style={[styles.saveChangesButton, styles.saveChangesButtonText]}
            title1="Save Change"
            onPress={onSubmit}
            loading={setEditMemoryResponse.isLoading}
          />
        </ScrollView>
      )}

      <DialogModal
        visible={showUploadModal}
        dialogStyle={styles.dialogStyle}
        children={
          <View style={styles.modalContentContainer}>
            <Text style={styles.uploadingText}>
              Uploading your memories to the memoryOak {'\n'} cloud. Please do
              not close the app until {'\n'} uploading is finished
            </Text>

            <Progress.Bar
              progress={uploadProgress}
              height={hp(2)}
              width={wp(80)}
              borderRadius={hp(3)}
              color={styles.activityColor.color}
            />
          </View>
        }
        contentStyle={styles.contentStyle}
      />
      <DialogModal
        visible={leaveModal}
        dialogStyle={styles.modalStyle}
        onPress={() => setLeaveModal(false)}
        children={
          <View>
            <View style={styles.rowContainer}>
              <Text style={styles.modalHeader}>Leave Memory</Text>
              <TouchableOpacity
                onPress={() => {
                  setLeaveModal(false);
                }}
                style={styles.modalCloseIcon}>
                <Ionicons
                  name={'close-circle-outline'}
                  size={40}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Are you sure about this?</Text>
            <Text style={styles.modalText}>
              You will lose access to this memory. If you are the only person in
              the memory, it will be deleted.
            </Text>
            <Button
              loading={leaveMemoryResponse.isLoading}
              style={[styles.modalButton, styles.modalButtonText]}
              title1="Leave Memory"
              onPress={() => leaveMemory()}
            />
          </View>
        }
      />
    </View>
  );
}

export default EditMemory;
