import {Dialog} from 'react-native-simple-dialogs';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';

function DialogModal(props) {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      dialogStyle: {
        backgroundColor: theme.color.backgroundColor,
        borderRadius: theme.borders.radius2,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  return (
    <Dialog
      keyboardShouldPersistTaps={'always'}
      dialogStyle={[styles.dialogStyle, props.dialogStyle]}
      contentStyle={props.contentStyle}
      onTouchOutside={props.onPress}
      visible={props.visible}
      onRequestClose={props.onPress}>
      {props.children}
    </Dialog>
  );
}

export default DialogModal;
