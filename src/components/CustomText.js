import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useThemeAwareObject} from '../theme';

const TextField = ({children, style, numberOfLines, onPress}) => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      textStyle: {
        color: theme.color.textBlack,
        fontSize: theme.size.xSmall,
        fontFamily: theme.fontFamily.lightFamily,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return (
    <Text
      style={[styles.textStyle, style]}
      onPress={onPress}
      allowFontScaling={false}
      numberOfLines={numberOfLines ?? null}>
      {children}
    </Text>
  );
};

export default TextField;
