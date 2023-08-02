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
      alignSelf: 'center',
      fontSize: hp(3),
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },

    inputContainerStyle: {
      width: hp(30),
      height: hp(10),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: hp(1),
      paddingHorizontal: wp(2),
      paddingVertical: hp(2),
      borderColor: theme.color.textBlack,
      borderWidth: hp(0.15),
      marginBottom: hp(3),
      marginTop: hp(2),
    },

    modalButton: {
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: hp(20),
      height: hp(6),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      backgroundColor: theme.color.backgroundColor,
      borderColor: theme.color.backgroundColor,
      marginBottom: hp(2),
    },

    modalButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textWhite,
    },

    saveChangesButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.semiBoldFamily,
      borderBottomColor: 'white',
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
      paddingHorizontal: hp(2),
      paddingTop: hp(1),
      paddingBottom: hp(3),
      justifyContent: 'space-between',
      // alignItems: 'flex-start',
    },
    homeText: {
      fontSize: theme.size.large,
    },

    footer: {
      paddingVertical: hp(3),
      paddingHorizontal: wp(5),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },

    invitePeopleButton: {
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: wp(50),
      height: hp(6.5),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      backgroundColor: theme.color.backgroundColor,
      borderColor: theme.color.backgroundColor,
      marginBottom: hp(3),
    },

    invitePeopleButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textWhite,
    },
    textFieldTile: {
      fontSize: hp(3),
      textAlign: 'center',
      fontFamily: theme.fontFamily.boldFamily,
    },
    avatarImage: {marginTop: hp(7), marginRight: wp(5)},
    fieldText: {
      fontSize: theme.size.medium,
      textAlign: 'center',
      fontFamily: theme.fontFamily.mediumFamily,
    },
    fieldTextUnderline: {
      fontSize: theme.size.medium,
      textAlign: 'center',
      fontFamily: theme.fontFamily.boldFamily,
      textDecorationLine: 'underline',
    },
    modalHeader: {
      flexDirection: 'row',
      marginBottom: hp(1),
    },
    modalCloseIcon: {
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    iconSize: hp(3),

    profileImage: {
      marginRight: wp(5),
      marginBottom: hp(3),
    },
    firstMemoryText: {
      fontSize: theme.size.medium,
      paddingBottom: hp(2),
    },
    dialogStyle: {
      backgroundColor: 'white',
      height: hp(50),
      width: wp(80),
      alignSelf: 'center',
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
    iconHeaderContainer: {width: '10%', paddingLeft: hp(1)},
    headerTitleContainer: {
      flexDirection: 'row',
      width: '90%',
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
    },
    emptyListStyle: {
      flex: 1,
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
    },
    emptyMessageStyle: {
      textAlign: 'center',
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.mediumFamily,
    },
  });
  return styles;
};
export default createStyles;
