import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Pinchable from 'react-native-pinchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Blurhash} from 'react-native-blurhash';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import {DeleteIcon, DownloadIcon, WhiteCommentIcon} from './Icons/Icons';
import Text from './CustomText';

const ViewMmeoryCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      namecontainer: {
        right: wp(3),
        bottom: hp(10),
        width: wp(15),
        position: 'absolute',
        zIndex: 3,
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
      container: {
        flex: 1,
        width: windowWidth,
        height: windowHeight,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);
  // const [blurHash, setBlurHash] = useState('');

  // let tempBlur;

  // useEffect(() => {
  //   makeHash();
  // }, []);

  // async function makeHash() {
  //   try {
  //     tempBlur = await Blurhash.encode(props.img, 4, 3);
  //     setBlurHash(tempBlur);
  //   } catch (e) {
  //     console.log('blur error', e, props.index);
  //   }
  // }

  const tempImage = () => {
    return (
      // <View style={{flex: 1}}>
      //   <Blurhash blurhash={blurHash} style={{flex: 1}} />
      // </View>
      <FastImage
        source={{uri: props.thumbnailUrl, priority: FastImage.priority.high}}
        resizeMode={FastImage.resizeMode.contain}
        style={{
          width: windowWidth,
          height: windowHeight,
          backgroundColor: 'black',
        }}>
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
      </FastImage>
    );
  };

  return (
    <Pinchable>
      {props.img ? (
        <FastImage
          source={{uri: props.img, priority: FastImage.priority.high}}
          resizeMode={FastImage.resizeMode.contain}
          style={{
            width: windowWidth,
            height: windowHeight,
            backgroundColor: 'black',
          }}
          onLoadStart={() => {
            setLoading(true);
          }}
          onLoad={() => {
            setLoading(false);
          }}>
          {loading ? (
            tempImage()
          ) : (
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
          )}
        </FastImage>
      ) : (
        tempImage
      )}
    </Pinchable>
  );
};

export default ViewMmeoryCard;
