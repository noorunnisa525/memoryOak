import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.backgroundColor,
    },
    headerText: {
      fontSize: theme.size.xLarge,
      color: theme.color.textWhite,
      fontFamily: theme.fontFamily.boldFamily,
      textAlign: 'center',
      marginVertical: hp(8),
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.backgroundColor,
    },
    headerColor: theme.color.backgroundColor,
    container: {
      flexGrow: 1,
      paddingHorizontal: hp(5),
      paddingBottom: hp(5),
      backgroundColor: theme.color.textWhite,
      borderTopRightRadius: theme.borders.radius3,
      borderTopLeftRadius: theme.borders.radius3,
      justifyContent: 'space-between',
    },
    loginText: {
      fontSize: hp(3),
      fontFamily: theme.fontFamily.boldFamily,
      paddingLeft: wp(5),
      paddingVertical: hp(5),
    },
    termsButton: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: wp(2),
      marginRight: wp(2),
    },
    loggingText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.mediumFamily,
      // marginHorizontal: wp(2),
    },
    socialText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      marginHorizontal: wp(2),
    },
    termsText: {
      fontSize: theme.size.small,
      color: theme.color.backgroundColor,
      textDecorationLine: 'underline',
    },
    socialButton: {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // paddingLeft: wp(8.5),
      // padding: hp(2.75),
      width: wp(73),
      height: hp(8),
      borderRadius: hp(2),
      borderWidth: hp(0.1),
      borderColor: theme.color.dividerColor,
      marginTop: hp(4),
    },

    termsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return styles;
};
export default createStyles;
