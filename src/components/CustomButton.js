import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useThemeAwareObject} from '../theme';
import {wp} from '../util';
import Text from './CustomText';

function CustomButton(props) {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      purpleColor: theme.color.backgroundColor,
      whiteColor: theme.color.textWhite,
      disabledButton: {
        backgroundColor: theme.color.headerBackgroundColor,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <>
      {!props.loading ? (
        !props.disabled ? (
          <TouchableOpacity style={props?.style[0]} onPress={props.onPress}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {props.icon && props.icon}

              <Text style={props?.style[1]}>
                {props?.title1}
                {props.title2 && (
                  <Text style={props.style[2]}> {props.title2}</Text>
                )}
              </Text>
            </View>
            {props.children && props.children}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled
            style={[props.style[0], styles.disabledButton]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {props.icon && props.icon}

              <Text style={props?.style[1]}>
                {props?.title1}
                {props.title2 && (
                  <Text style={props.style[2]}> {props.title2}</Text>
                )}
              </Text>
            </View>
            {props.children && props.children}
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity
          disabled
          style={[props.style[0]]}
          onPress={props.onPress}>
          <ActivityIndicator
            color={props.loaderPurple ? styles.purpleColor : styles.whiteColor}
          />
        </TouchableOpacity>
      )}
    </>
  );
}

export default CustomButton;
