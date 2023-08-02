import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {useThemeAwareObject} from '../theme';
import {hp} from '../util';
import ResponsiveText from './CustomText';

const createStyles = theme => {
  const styles = StyleSheet.create({
    buttonStyle: {
      borderRadius: 10,
      height: hp(6),
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      alignItems: 'center',

      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: theme.color.dividerColor,
      //  borderWidth: 1,
      //   borderColor: theme.color.backgroundColor,
    },

    buttonText: {
      marginLeft: 0,
      color: theme.color.textBlack,
      textAlign: 'center',
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
    },

    buttonEnabledColor: {
      backgroundColor: 'white',
    },

    buttonDisabledColor: {
      //   backgroundColor: theme.color.disabled,
    },
  });
  return styles;
};

const IconButton = props => {
  const styles = useThemeAwareObject(createStyles);

  return (
    <TouchableOpacity
      style={{
        ...styles.buttonStyle,
        ...props.buttonStyle,
        ...styles.buttonEnabledColor,
      }}
      onPress={() => props.onPress()}>
      <ResponsiveText style={{...styles.buttonText, ...props.textStyle}}>
        {props.title}
      </ResponsiveText>

      <Icon
        name={props.iconName}
        type={props.iconType}
        style={{alignSelf: 'flex-end'}}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
