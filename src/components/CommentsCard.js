import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import {DeleteGrayIcon} from './Icons/Icons';

const CommentsCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      namecontainer: {
        width: wp(85),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 2,
      },
      nameText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        paddingLeft: hp(2),
        width: wp(70),
      },
      momentText: {
        fontSize: theme.size.xSmall,
        color: theme.color.dividerColor,
        fontFamily: theme.fontFamily.boldFamily,
        paddingLeft: hp(2),
        width: wp(55),
      },
      commentText: {
        fontSize: theme.size.Small,
        fontFamily: theme.fontFamily.mediumFamily,
        paddingLeft: hp(2),
        width: wp(65),
        paddingBottom: hp(1),
      },

      listItem: {
        margin: hp(2),
        width: '92%',
        alignSelf: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        borderBottomWidth: hp('0.1'),
        borderBottomColor: theme.color.dividerColor,
        // height: hp('10'),
      },
      iconContainer: {
        right: 0,
        top: 0,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={styles.listItem}>
      {props.img ? (
        <Image
          source={{uri: props.img}}
          style={{
            width: 50,
            height: 50,
            borderRadius: 30,
          }}
        />
      ) : (
        <Image
          source={require('../components/ImagePicker/Icons/avatar-placeholder.jpg')}
          style={{
            width: 50,
            height: 50,
            borderRadius: 30,
          }}
        />
      )}
      <View style={styles.namecontainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.nameText}>{props.name}</Text>

          {props.isCreatedByCurrentUser && (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={props.onPressDelete}>
              <DeleteGrayIcon />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.momentText}>{props.moment}</Text>
        <Text style={styles.commentText}>{props.comment}</Text>
      </View>
    </View>
  );
};

export default CommentsCard;
