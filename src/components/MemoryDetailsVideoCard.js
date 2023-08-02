import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';

const MemoryDetailsVideoCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      avatarImage: {
        marginRight: wp(5),
      },

      options: {
        backgroundColor: theme.color.textWhite,
        flexDirection: 'row',
      },
      option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatar: {
        height: hp(13),
        width: wp(35),
        borderRadius: theme.borders.radius1,
        backgroundColor: 'transparent',
        // padding: 20,
      },
      loadingIndicator: {
        height: hp(25),
        width: wp(43.5),
        borderRadius: theme.borders.radius1,
        backgroundColor: 'transparent',
        borderColor: 'lightgray',
        borderWidth: 1,
        margin: hp(1),
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 20,
      },
      coverImage: {
        height: hp(13),
        width: wp(35),
        borderRadius: theme.borders.radius1,
        backgroundColor: 'transparent',

        // padding: 20,
      },
      TextContainer: {
        justifyContent: 'space-between',
        margin: hp(0.75),
        padding: hp(0.75),
        backgroundColor: 'transparent',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
        // top: 0,
      },
      commentContainer: {
        justifyContent: 'space-between',
        margin: hp(0.75),
        padding: hp(0.75),
        // position: 'absolute', //Here is the trick
        // bottom: 0, //Here is the trick
        alignSelf: 'flex-end',
        alignItems: 'center',
      },
      taskCard: {
        borderRadius: theme.borders.radius1,
        borderColor: 'lightgray',
        borderWidth: 1,
        margin: hp(1),
      },
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: theme.colors.accent,
        marginBottom: 2,
      },
      memoryText: {
        // fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textWhite,
        // color: 'red',
      },
      commentText: {
        // fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textWhite,
        // color: 'red',
      },
      overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: hp(2),
        borderColor: 'lightgray',
        // backgroundColor: 'lightgray',
      },
      loadingColor: {
        color: theme.color.backgroundColor,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  const [videoThumbnail, setVideoThumbnail] = useState('');

  // useEffect(() => {
  //   createThumbnail({
  //     url: props.url,
  //     timeStamp: 10000,
  //   })
  //     .then(response => {
  //       setVideoThumbnail(response.path);
  //     })
  //     .catch(err => console.log({err}));
  // }, []);

  return videoThumbnail ? (
    <TouchableOpacity style={styles.taskCard} onPress={props.onPress}>
      {/* <FastImage
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.avatar, props.imgStyle]}
        imageStyle={{borderRadius: 10}}
        {...props}
        source={{uri: videoThumbnail, priority: FastImage.priority.high}}> */}
      <View style={styles.TextContainer}>
        <Text style={[styles.memoryText, props.imgText]}>{props.cardText}</Text>
      </View>
      {props.comment && (
        <View style={styles.commentContainer}>
          <FontAwesome name={'comment'} size={24} color={'white'} />
          <Text style={styles.commentText}>{props.comment}</Text>
        </View>
      )}
      <View style={styles.overlay} />
      {/* </FastImage> */}
    </TouchableOpacity>
  ) : (
    <View style={styles.loadingIndicator}>
      <ActivityIndicator size={'large'} color={styles.loadingColor.color} />
    </View>
  );
};

export default MemoryDetailsVideoCard;
