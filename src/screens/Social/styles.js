import { StyleSheet } from 'react-native';
import { hp, wp } from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    socialContainer: {
      marginTop: hp(4),
    },
    socialFontFamily: theme.fontFamily.boldFamily,

    socialIcons: {
      marginBottom: hp(4),
      backgroundColor: theme.color.textWhite,
      borderWidth: 1,
      borderColor: theme.color.dividerColor,
      borderRadius: theme.borders.radius2,
    },
    iconText: {
      color: theme.color.textBlack,
      fontSize: theme.size.medium,
    },
    iconColor: theme.color.avatarColor,
    iconSize: hp(5),

  });
  return styles;
};
export default createStyles;
