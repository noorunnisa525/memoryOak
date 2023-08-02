import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useThemeAwareObject} from '../theme';
import {hp} from '../util';
import Text from './CustomText';

const PeopleCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      namecontainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: theme.colors.accent,
        marginBottom: hp('2'),
      },
      nameText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        paddingLeft: hp(2),
      },

      listItem: {
        margin: 10,
        width: '95%',
        height: hp('8'),
        alignSelf: 'center',
        flexDirection: 'row',
        borderRadius: 5,

        borderBottomWidth: hp('0.1'),
        borderBottomColor: theme.color.dividerColor,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={styles.listItem}>
      {props.img ? (
        <FastImage
          source={{uri: props.img, priority: FastImage.priority.high}}
          style={{
            width: 50,
            height: 50,
            borderRadius: 30,
            backgroundColor: 'black',
          }}
        />
      ) : (
        <FastImage
          source={require('../components/ImagePicker/Icons/avatar-placeholder.jpg')}
          style={{
            width: 50,
            height: 50,
            borderRadius: 30,
            backgroundColor: 'black',
          }}
        />
      )}
      <View style={styles.namecontainer}>
        <Text style={styles.nameText}>{props.name}</Text>
      </View>
    </View>
  );
};

export default PeopleCard;
