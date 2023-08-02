import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VideoPlayer from 'react-native-video-player';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import {DeleteIcon, DownloadIcon, WhiteCommentIcon} from './Icons/Icons';

const ViewMmeoryVideoCard = props => {
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      namecontainer: {
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
        right: 15,
        bottom: 0,
        width: wp(15),
        height: hp(20),
        position: 'absolute',
        zIndex: 3,
        marginBottom: hp(10),
      },
      nameText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        paddingLeft: hp(2),
      },

      listItem: {
        alignSelf: 'center',
        flexDirection: 'row',
      },
      iconContainer: {
        width: wp(11),
        height: wp(11),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 20,
        marginTop: hp(2),
        // zIndex: 3, // works on ios
        // elevation: 3,
        // shadowColor: 'lightgray',
        backgroundColor: theme.color.overlay,
      },
      backgroundVideo: {
        // position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '80%',
        height: '100%',
      },
      container: {
        backgroundColor: theme.color.textBlack,
        width: windowWidth,
        height: windowHeight,
      },
      mediaPlayer: {
        flex: 1,
      },
      namecontainer: {
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
        right: 15,
        bottom: 0,
        width: wp(15),
        height: hp(20),
        position: 'absolute',
        zIndex: 3,
        marginBottom: hp(10),
      },
      iconContainer: {
        width: wp(10),
        height: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(20),
        zIndex: 3, // works on ios
        elevation: 3,
        shadowColor: 'lightgray',
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

  return (
    <View style={{backgroundColor: 'black'}}>
      <View style={styles.namecontainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={props.commentsMmeory}>
          <WhiteCommentIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={props.downloadMmeory}>
          <DownloadIcon />
        </TouchableOpacity>

        {props.isCreatedByCurrentUser && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={props.deleteMemory}>
            <DeleteIcon />
          </TouchableOpacity>
        )}
      </View>

      {/* <VideoPlayer
        thumbnail={{uri: videoThumbnail}}
        video={{uri: props.url}}
        videoWidth={windowWidth}
        videoHeight={windowHeight}
        autoplay={false}
        showDuration
        defaultMuted={false}
        fullScreenOnLongPress={true}
        style={{borderRadius: 10}}
      /> */}
    </View>
  );
};

export default ViewMmeoryVideoCard;
