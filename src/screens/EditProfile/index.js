import * as Progress from 'react-native-progress';

import React, {useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {
  delete_account,
  get_User,
  uploaded_media,
  user_profile_pic_add,
  user_update_email,
} from '../../services/api-config';
import {hp, wp} from '../../util';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Avatar} from 'react-native-elements';
import Button from '../../components/CustomButton';
import CustomInputField from '../../components/CustomInputField';
import DialogModal from '../../components/DialogModal';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../components/LoggedInHeader';
import ImageCropPicker from '../../components/ImagePicker/ImageCropPicker';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Text from '../../components/CustomText';
import createStyles from './styles';
import {clearUser, logOut, setUserByEmail} from '../../redux/slices/userSlice';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {clearSubscription} from '../../redux/slices/stripeSlice';

const EditProfile = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const [isFnameValidError, setFnameValidError] = useState(false);
  const [isLnameValidError, setLnameValidError] = useState(false);
  const [editAccountCall, editAccountResponse] = usePostApiMutation();
  const [deleteAccountCall, deleteAccountResponse] = usePostApiMutation();
  const [editProfilePicCall, editProfilePicResponse] = usePostApiMutation();
  const email = useSelector(state => state.user?.userData?.email);
  const userInfoToken = useSelector(state => state.user.userData.tokens.access);
  const [imageResponse, setResponse] = useState();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState();
  const [uri, setUri] = useState(null);
  const [getUserCall, userResponse] = usePostApiMutation();
  const [deleteModal, setDeleteModal] = useState(false);
  const [imageSize, setImageSize] = useState();
  const [onPressAvatar, toggleAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    let data = {
      url: get_User + `${email}/`,
      method: 'GET',
      token: userInfoToken,
    };

    try {
      let user = await getUserCall(data).unwrap();
      setFirstName(user?.first_name);
      setLastName(user?.last_name || user?.middle_name);
      setUri(user?.user_profile_pic || user?.profile_pic_url);
      dispatch(setUserByEmail(user));
    } catch (e) {}
  };

  const editAccount = async () => {
    let data = {
      first_name: firstName,
      middle_name: lastName,
      last_name: '',
      date_of_birth: '2021-07-16',
    };

    let apiData = {
      url: user_update_email + `${email}/`,
      data: data,
      method: 'PATCH',
      token: userInfoToken,
    };

    try {
      let hold = await editAccountCall(apiData).unwrap();
      navigation.pop();
    } catch (e) {}
  };
  const deleteAccount = async () => {
    let apiData = {
      url: delete_account,
      data: {},
      method: 'POST',
      token: userInfoToken,
    };

    try {
      let hold = await deleteAccountCall(apiData).unwrap();
      if (hold.success) {
        setDeleteModal(false);
        dispatch(logOut(false));
        dispatch(clearUser());
        dispatch(clearSubscription());
      }
    } catch (e) {}
  };
  const editAccountPic = async (firstName, lastName) => {
    let data = {
      filename: image,
      size: imageSize,
    };
    let apiData = {
      url: user_profile_pic_add,
      data: data,
      method: 'POST',
      token: userInfoToken,
    };
    try {
      let editAccountPicApi = await editProfilePicCall(apiData).unwrap();
      setShowUploadModal(true);
      uploadToS3(editAccountPicApi.data, editAccountPicApi);
      if (firstName != '' && lastName != '') {
        editAccount();
      }
    } catch (e) {}
  };
  const uploadToS3 = async imageResponseData => {
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
    data.append(
      'key',
      imageResponseData.file_bucket_path + imageResponseData.filename,
    );
    data.append('acl', 'private');
    data.append('Content-Type', contentType);
    data.append('AWSAccessKeyId', imageResponseData.key);
    data.append('Policy', imageResponseData.policy);
    data.append('filename', imageResponseData.filename);
    data.append('Signature', imageResponseData.signature);
    data.append('file', imageObject);
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        var status = request.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          // isUploaded(imageResponseData);
          setShowUploadModal(false);
          setUploadProgress(0);
          navigation.pop();
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

  const isUploaded = async dataa => {
    const data = {
      media_ids: [dataa.file_id],
    };

    let apiData = {
      url: uploaded_media,
      data: data,
      method: 'POST',
      token: userInfoToken,
    };
    try {
      let uploadedMedia = await editAccountCall(apiData).unwrap();

      if (uploadedMedia) {
        getUser();
      }
    } catch (e) {}
  };

  const onSubmit = date => {
    validateInputField();
    if (isFnameValidError == false && isLnameValidError == false) {
      if (onPressAvatar) {
        editAccountPic(firstName, lastName);
      } else {
        editAccount();
      }
    }
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
    toggleAvatar(true);
    const {path} = ImageOrVideo;
    setResponse(ImageOrVideo);
    setUri(ImageOrVideo.path);
    // let urlDecoded = decodeURIComponent(path);
    // urlDecoded = urlDecoded.replace('file://', '');
    setImage(path);
    setImageSize(ImageOrVideo.size);
  };

  const validateInputField = (val, type) => {
    var regEx = /^[A-Za-z]+$/;

    if (type == 'firstname') {
      if (val?.length === 0 && val?.length === null) {
        setFnameValidError(false);
      } else if (val?.match(regEx)) {
        setFnameValidError(false);
      } else {
        setFnameValidError(true);
      }
    } else if (type == 'lastname') {
      if (val?.length === 0 && val?.length === null) {
        setLnameValidError(false);
      } else if (val?.match(regEx)) {
        setLnameValidError(false);
      } else {
        setLnameValidError(true);
      }
    } else {
      setFnameValidError(false);
      setLnameValidError(false);
    }
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
        <TouchableOpacity style={{width: wp(10)}}>
          <MaterialCommunityIcons
            name={'keyboard-backspace'}
            size={30}
            color={'black'}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </TouchableOpacity>
        <Text style={styles.headerInitialText}>Edit Account</Text>

        <TouchableOpacity style={{width: wp(10)}}>
          <FontAwesome5
            name={'trash'}
            size={22}
            color={'black'}
            onPress={() => {
              setDeleteModal(true);
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <>
          <Avatar
            source={
              uri
                ? {uri: uri}
                : require('../../components/ImagePicker/Icons/avatar-placeholder.jpg')
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
            avatar={require('../../components/ImagePicker/Icons/avatar-placeholder.jpg')}
            onChange={onChange}
            uri={uri}
            profile={true}
            mediaType={true}
            setMediaOpen={setMediaOpen}
            camera={true}
          /> */}

          <View style={styles.memoryContainer}>
            <Text style={styles.textFieldTile}>First Name</Text>
            <CustomInputField
              inputStyle={styles.saveChangesButtonText}
              inputContainerStyle={{borderColor: 'lightgray'}}
              placeholder={'Enter First Name'}
              numberOfLines={1}
              maxLength={25}
              value={firstName}
              onChangeText={text => {
                setFirstName(text);
                validateInputField(text, 'firstname');
              }}
              rightIcon={
                !isFnameValidError ? (
                  <Feather
                    name={'check-circle'}
                    size={20}
                    color={'green'}
                    onPress={() => {}}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={'close-circle-outline'}
                    size={22}
                    color={'red'}
                    onPress={() => {}}
                  />
                )
              }
            />

            <Text style={styles.textFieldTile}>Last Name</Text>
            <CustomInputField
              inputStyle={styles.saveChangesButtonText}
              inputContainerStyle={{borderColor: 'lightgray'}}
              placeholder={'Enter Last Date'}
              numberOfLines={1}
              maxLength={25}
              value={lastName}
              onChangeText={value => {
                setLastName(value);
                validateInputField(value, 'lastname');
              }}
              rightIcon={
                !isLnameValidError ? (
                  <Feather
                    name={'check-circle'}
                    size={20}
                    color={'green'}
                    onPress={() => {}}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={'close-circle-outline'}
                    size={22}
                    color={'red'}
                    onPress={() => {}}
                  />
                )
              }
            />
          </View>
          <Button
            style={[styles.saveChangesButton, styles.saveChangesButtonText]}
            title1="Save Changes"
            onPress={() => onSubmit()}
            loaderPurple={true}
            loading={editAccountResponse.isLoading}
          />
        </>
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
              color={'#d06ffe'}
            />
          </View>
        }
        contentStyle={styles.contentStyle}
      />
      <DialogModal
        visible={deleteModal}
        dialogStyle={styles.dialogStyle}
        contentStyle={styles.modalStyle}
        onPress={() => setDeleteModal(false)}
        children={
          <>
            <TouchableOpacity
              onPress={() => {
                setDeleteModal(false);
              }}
              style={styles.modalCloseIcon}>
              <Ionicons name={'close-circle-outline'} size={40} color="grey" />
            </TouchableOpacity>

            <Text style={styles.textDelete}>Delete Account</Text>
            <View style={styles.modalContentContainer}>
              <Text style={styles.textAlert}>
                Are you sure about this? Your account will be deleted in 30 days
                and you will lose access to all your memories.
              </Text>

              <Button
                loading={deleteAccountResponse.isLoading}
                loaderPurple
                style={[styles.profileButton, styles.newMemoryButtonText]}
                title1="Delete Account"
                onPress={() => {
                  deleteAccount();
                }}
              />
              <Button
                style={[styles.deleteButton, styles.deleteBtnText]}
                title1="I'll Do it Later"
                onPress={() => {
                  setDeleteModal(false);
                }}
              />
            </View>
          </>
        }
      />
    </View>
  );
};

export default EditProfile;
