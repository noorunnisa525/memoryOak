import * as Progress from 'react-native-progress';

import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {create_memory, memory_cover_photo} from '../../services/api-config';
import {hp, wp} from '../../util';

import {Avatar} from 'react-native-elements';
import Button from '../../components/CustomButton';
import CustomInputField from '../../components/CustomInputField';
import DateTimePicker from '../../components/CustomDatePicker';
import DialogModal from '../../components/DialogModal';
import Header from '../../components/LoggedInHeader';
import ImageCropPicker from '../../components/ImagePicker/ImageCropPicker';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../components/CustomText';
import createStyles from './styles';
import moment from 'moment';
import {usePostApiMutation} from '../../services/service';
import {useSelector} from 'react-redux';
import {useThemeAwareObject} from '../../theme/index';

function CreateMemory({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [date, setDate] = useState(new Date());
  const [titleError, setTitleError] = useState('');
  const [title, setTitleName] = useState('');
  const userInfoToken = useSelector(state => state.user.userData.tokens.access);
  const email = useSelector(state => state.user.userData.email);
  const [uri, setUri] = useState();
  const [coverPhoto, setCoverPhoto] = useState();
  const [memoryPic, setMmeoryPic] = useState();
  const [memoryPicSize, setMmeoryPicSize] = useState();
  const [createMmeoryCall, createMmeoryResponse] = usePostApiMutation();
  const [editMemoryPicCall, edirMemoryPicResponse] = usePostApiMutation();
  const [imageResponse, setResponse] = useState();
  const [mediaOpen, setMediaOpen] = useState(false);
  const [onPressAvatar, toggleAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const onAvatarChange = ImageOrVideo => {
    setResponse(ImageOrVideo);
    toggleAvatar(true);
    const {path} = ImageOrVideo;
    let urlDecoded = decodeURIComponent(path);
    urlDecoded = urlDecoded.replace('file://', '');
    let lastIndex = urlDecoded.lastIndexOf('.');
    let result = urlDecoded.slice(0, lastIndex);
    result = result + '.jpeg';
    setMmeoryPic(result);
    setUri(ImageOrVideo.path);
    setMmeoryPicSize(ImageOrVideo.size);
  };
  const handleError = () => {
    setTitleError('');
    if (title == '') {
      setTitleError('Title must not be empty*');
    } else {
      createMemory();
    }
  };

  const onSubmit = date => {
    handleError();
  };

  const editMemoryCover = async (id, memoryDetailData) => {
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

      uploadToS3(editMmeoryCoverApi.data, memoryDetailData);
    } catch (e) {}
  };

  const uploadToS3 = async (dataa, memoryDetailData) => {
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
          navigation.pop();
          navigation.navigate('MemoryDetails', memoryDetailData);
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

  const createMemory = async () => {
    let data = {
      title: title,
      date: moment(date).format('YYYY-MM-DDTHH:mm:ss.000Z'),
      description: '',
      shared_users: [email],
      shared_groups: [],
      admin_list: [],
      media_list: [],
      cover_photo:
        'https://assets.6sigma.us/wp-content/uploads/2017/05/bill-gates-jpg.jpg?x92000',
    };
    let apiData = {
      url: create_memory,
      data: data,
      method: 'POST',
      token: userInfoToken,
    };
    try {
      let apiCreateMmeoryData = await createMmeoryCall(apiData).unwrap();

      let memoryDetailData = {
        item: apiCreateMmeoryData,
        id: apiCreateMmeoryData.id,
      };

      if (onPressAvatar) {
        editMemoryCover(apiCreateMmeoryData?.id, memoryDetailData);
      } else {
        navigation.pop();
        navigation.navigate('MemoryDetails', memoryDetailData);
      }
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
        onAvatarChange(image);
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
        <MaterialCommunityIcons
          name={'keyboard-backspace'}
          size={30}
          color={'black'}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerInitialText}>Create Memory</Text>
        <View style={{width: '10%'}}></View>
      </View>

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
          onChange={onAvatarChange}
          coverPhoto={coverPhoto}
          setCoverPhoto={setCoverPhoto}
          uri={uri}
          setMmeoryPic={setMmeoryPic}
          setMmeoryPicSize={setMmeoryPicSize}
          setResponse={setResponse}
          avatar={require('../../../assets/images/Memory_Default_thumbnail.jpg')}
          profile={true}
          mediaType={true}
          setMediaOpen={setMediaOpen}
          camera={true}
        /> */}

        <View style={styles.memoryContainer}>
          <Text style={styles.textFieldTile}>Title</Text>
          <CustomInputField
            placeholder={'Enter memory title'}
            inputContainerStyle={{borderColor: 'lightgray'}}
            numberOfLines={1}
            maxLength={25}
            onChangeText={text => setTitleName(text)}
          />
          {title == '' && (
            <Text style={styles.textFieldError}>{titleError}</Text>
          )}
          <Text style={styles.textFieldTile}>Date</Text>
          <DateTimePicker value={date} type="date" setCurrentDate={setDate} />
        </View>

        <Button
          style={[styles.newMemoryButton, styles.newMemoryButtonText]}
          title1="Create Memory "
          onPress={() => onSubmit()}
          loading={createMmeoryResponse.isLoading}
        />
      </ScrollView>

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
    </View>
  );
}

export default CreateMemory;
