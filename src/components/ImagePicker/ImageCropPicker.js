import React, {useState} from 'react';
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {useThemeAwareObject} from '../../theme';
import {hp, wp} from '../../util';
import Text from '../CustomText';
import {CameraIcon, ImageIcon} from './Icons/Index';

const ImageCropPicker = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      avatarImage: {
        marginRight: wp(5),
      },

      options: {
        backgroundColor: theme.color.textWhite,
        flexDirection: 'row',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
      },
      option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatar: {
        height: hp(15),
        width: hp(15),
        borderRadius: hp(15),

        // padding: 20,
      },
      editIconContainer: {
        borderWidth: 1,
        borderColor: theme.color.textWhite,
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(8),
        height: hp(4),
        backgroundColor: theme.color.headerBackgroundColor,
        borderRadius: hp(10),
        flexDirection: 'row',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
        right: 1,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  const [visible, setVisible] = useState(false);
  const close = () => {
    setVisible(false), props.setMediaOpen(false);
  };
  const open = () => {
    setVisible(true);
  };
  const dispatch = useDispatch();
  const chooseImage = () => {
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      cropping: false,
      maxFiles: 200,

      mediaType: 'photo',
      // mediaType: props.mediaType ? 'any' : false,
      multiple: props.multipleMedia ? true : false,
    })
      .then(image => {
        props.onChange(image);
      })
      .catch(e => console.log(e, 'error'))
      .finally(close);
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      // width: 300,
      // height: 400,
      cropping: true,
    })
      .then(image => {
        props.onChange(image);
      })
      .finally(close);
  };

  return (
    <>
      <TouchableOpacity onPress={open} style={{}}>
        {props.profile && (
          <ImageBackground
            resizeMode="cover"
            style={styles.avatar}
            imageStyle={{
              borderRadius: 500,
              backgroundColor: 'black',
            }}
            {...props}
            source={props?.uri ? {uri: props?.uri} : props.avatar}>
            <View style={styles.editIconContainer}>
              <MaterialIcons name={'edit'} size={15} color={'white'} />
            </View>
          </ImageBackground>
        )}
      </TouchableOpacity>
      <Modal
        isVisible={props.mediaOpen == true ? true : visible ? true : false}
        onBackButtonPress={close}
        onBackdropPress={close}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <SafeAreaView style={styles.options}>
          <Pressable style={styles.option} onPress={chooseImage}>
            <ImageIcon />
            <Text>Library </Text>
          </Pressable>
          {props.camera ? (
            <Pressable style={styles.option} onPress={openCamera}>
              <CameraIcon />
              <Text>Camera</Text>
            </Pressable>
          ) : null}
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default ImageCropPicker;
