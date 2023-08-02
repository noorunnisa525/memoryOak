import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.textWhite,
    },
    subContainer: {
      height: hp(12),
      backgroundColor: theme.color.headerBackgroundColor,
      borderBottomLeftRadius: hp(5),
      borderBottomRightRadius: hp(5),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: hp(2),
      alignItems: 'center',
      paddingBottom: hp(2),
    },
    headerInitialText: {
      // paddingLeft: hp(2.5),
      fontSize: hp(3),
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    headerLastText: {
      fontSize: theme.size.xLarge,
      color: theme.color.backgroundColor,
      textAlign: 'center',
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.headerBackgroundColor,
    },
    headerColor: theme.color.headerBackgroundColor,
    addMemoryIcon: theme.color.backgroundColor,
    container: {
      flexGrow: 1,
      // paddingHorizontal: hp(8),
      paddingTop: hp(10),
      paddingBottom: hp(3),
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dialogStyle: {
      backgroundColor: 'white',
      height: hp(20),
      width: wp(100),
      alignSelf: 'center',
    },
    activityColor: {color: theme.color.backgroundColor},
    uploadingText: {
      paddingBottom: hp(2),
      fontSize: theme.size.small,
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
      textAlign: 'center',
    },
    modalCloseIcon: {justifyContent: 'flex-end', alignSelf: 'flex-end'},
    modalContentContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    homeText: {
      fontSize: theme.size.large,
    },
    newMemoryButton: {
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      // padding: hp(2.75),
      width: wp(50),
      height: hp(6.5),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      borderColor: theme.color.headerBackgroundColor,
    },

    newMemoryButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
    },
    textFieldTile: {
      fontSize: theme.size.medium,
      textAlign: 'left',
      paddingLeft: hp(1.25),
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.avatarColor,
    },
    textFieldError: {
      textAlign: 'left',
      paddingLeft: hp(1),
      color: theme.color.textRed,
      marginTop: -hp(3.5),
    },
    avatarImage: {marginTop: hp(7), marginRight: wp(5)},
    memoryContainer: {
      // alignSelf: 'center',
      // justifyContent: 'space-between',
      // alignItems: 'flex-start',
      width: wp(80),
      height: hp(20),
      marginBottom: hp(20),
    },
    profileImage: {
      marginRight: wp(5),
      marginBottom: hp(3),
    },
    firstMemoryText: {
      fontSize: theme.size.medium,
      paddingBottom: hp(2),
    },

    contentStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    profileButton: {
      margin: hp(1),
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: wp(40),
      height: hp(6),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      borderColor: theme.color.headerBackgroundColor,
    },
    iconHeaderContainer: {
      flexDirection: 'row',
      width: '10%',
      paddingLeft: hp(1.5),
    },
    headerTitleContainer: {
      flexDirection: 'row',
      width: '70%',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center',
    },
    avatarContainer1: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      // top: hp(10),
      right: 0,
      left: 0,
      // position: 'absolute',
      // zIndex: 99,
      backgroundColor: 'red',
    },
    avatarAccessory: {
      size: wp(7),
      height: wp(7),
      width: wp(7),
      color: theme.color.textWhite,
      backgroundColor: theme.color.headerBackgroundColor,
      borderRadius: 15,
    },
    avatarAccessoryContainer: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowColor: 'transparent',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0,
      shadowRadius: 0,
    },
  });
  return styles;
};
export default createStyles;
