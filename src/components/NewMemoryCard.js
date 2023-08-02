import React, {useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import {WhiteCommentIcon} from './Icons/Icons';

const NewMemoryCard = props => {
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
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
        // top: 0,
        backgroundColor: theme.color.overlay,
        borderRadius: theme.borders.radius1,
      },
      commentContainer: {
        justifyContent: 'space-between',
        margin: hp(0.75),
        padding: hp(0.75),
        // position: 'absolute', //Here is the trick
        // bottom: 0, //Here is the trick
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: theme.color.overlay,
        borderRadius: theme.borders.radius1,
      },
      taskCard: {
        borderRadius: theme.borders.radius1,
        borderColor: 'transparent',
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
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  const [showText, setShowText] = useState(false);

  return (
    <TouchableOpacity style={styles.taskCard} onPress={props.onPress}>
      <ImageBackground
        source={
          props.img
            ? require('../../assets/images/imageSkeleton.jpeg')
            : require('../../assets/images/placeholder2.png')
        }
        resizeMode={'cover'}
        imageStyle={{borderRadius: 10}}
        style={[styles.avatar, props.imgStyle]}>
        {!props.img && props.cardText && (
          <View style={styles.TextContainer}>
            <Text style={[styles.memoryText, props.imgText]} numberOfLines={2}>
              {props.cardText}
            </Text>
          </View>
        )}
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          style={[styles.avatar, props.imgStyle]}
          imageStyle={{borderRadius: 10}}
          {...props}
          onLoad={() => setShowText(true)}
          source={{uri: props.img, priority: FastImage.priority.high}}>
          {showText && props.cardText && (
            <View style={styles.TextContainer}>
              <Text
                style={[styles.memoryText, props.imgText]}
                numberOfLines={2}>
                {props.cardText}
              </Text>
            </View>
          )}
          {showText && props.comment && (
            <View style={styles.commentContainer}>
              <WhiteCommentIcon height={wp(10)} width={wp(10)} />
              <Text style={styles.commentText}>{props.comment}</Text>
            </View>
          )}

          <View style={styles.overlay} />
        </FastImage>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default NewMemoryCard;
