import React, {useState} from 'react';
import {Image, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {useThemeAwareObject} from '../theme';
import {hp} from '../util';

function CustomAvatar(props) {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      avatarContainer: {
        borderColor: theme.color.textWhite,
        borderWidth: hp('0.25'),
      },
      accessoryBackgroundColor: {backgroundColor: theme.color.backgroundColor},
    });
    return themeStyles;
  };

  const styles = useThemeAwareObject(createStyles);
  const [loading, setLoading] = useState(true);
  return props.image == null ? (
    <TouchableOpacity onPress={props.onPressAvatar} disabled={props.disabled}>
      <Avatar
        source={require('./ImagePicker/Icons/avatar-placeholder.jpg')}
        rounded
        size={props.size}
        containerStyle={[styles.avatarContainer, props.avatarContainer]}>
        {props.acessory == null ? null : (
          <Avatar.Accessory size={30} style={styles.accessoryBackgroundColor} />
        )}
      </Avatar>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={props.onPressAvatar} disabled={props.disabled}>
      <FastImage
        onLoad={() => {
          setLoading(false);
        }}
        source={
          loading
            ? require('./ImagePicker/Icons/avatar-placeholder.jpg')
            : {uri: props.image}
        }
        style={[styles.avatarContainer, props.avatarContainer]}>
        {props.acessory == null ? null : (
          <Avatar.Accessory size={30} style={styles.accessoryBackgroundColor} />
        )}
      </FastImage>
    </TouchableOpacity>
  );
}

export default CustomAvatar;
