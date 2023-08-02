import React from 'react';
import {StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';

const CustomInputField = ({
  placeholder,
  onChangeText,
  onChange,
  value,
  leftIcon,
  rightIcon,
  onBlur,
  secureTextEntry,
  keyboardType,
  editable,
  multiline,
  maxLength,
  style,
  containerStyle,
  inputContainerStyle,
  onPress,
  numberOfLines,
  inputContainer,
  inputStyle,
}) => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      inputContainer: {
        borderWidth: 1,
        borderColor: theme.color.dividerColor,
        borderRadius: theme.borders.radius2,
        paddingHorizontal: wp(2),
        height: hp(6),
      },
      textStyle: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
      },
      placeholderColor: 'black',
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return (
    <Input
      inputStyle={inputStyle}
      containerStyle={containerStyle}
      onPress={onPress}
      inputContainerStyle={[inputContainerStyle, inputContainer]}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      secureTextEntry={secureTextEntry}
      editable={editable}
      multiline={multiline}
      placeholder={placeholder}
      numberOfLines={numberOfLines}
      placeholderTextColor={styles.placeholderColor}
      style={[styles.textStyle, style]}
      maxLength={maxLength}
      onChangeText={onChangeText}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      keyboardType={keyboardType}
    />
  );
};

export default CustomInputField;
