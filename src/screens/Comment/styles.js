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

      alignSelf: 'center',
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },

    footer: {
      paddingVertical: hp(3),
      paddingHorizontal: wp(5),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
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
      // paddingHorizontal: hp(2),
      paddingTop: hp(1),
      paddingBottom: hp(3),
      justifyContent: 'flex-start',
      // alignItems: 'center',
    },
    homeText: {
      fontSize: theme.size.large,
    },
    saveChangesButtonText: {
      fontSize: theme.size.medium,
      color: 'black',

      // marginTop: hp(1),
      // fontFamily: theme.fontFamily.boldFamily,
    },
    inviteCommentButton: {
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

    inviteCommentButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textWhite,
    },
    textFieldTile: {
      fontSize: theme.size.medium,
      textAlign: 'left',
      paddingLeft: hp(1),
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.dividerColor,
    },
    avatarImage: {marginTop: hp(7), marginRight: wp(5)},

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
      height: hp(45),
      width: wp(60),
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
      alignItems: 'center',
      alignSelf: 'center',
    },
    emptyMessageStyle: {
      textAlign: 'center',
      alignSelf: 'center',
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.dividerColor,
    },
    modalStyle: {
      backgroundColor: 'white',
      alignSelf: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: hp(5),
    },
    modalHeader: {
      flex: 1,
      fontSize: hp(2.7),
      textAlign: 'center',
      fontFamily: theme.fontFamily.boldFamily,
    },
    modalCloseIcon: {
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    modalText: {
      fontSize: hp(2.2),
      alignSelf: 'center',
      textAlign: 'center',
      fontFamily: theme.fontFamily.mediumFamily,
      width: wp(60),
    },
    modalButton: {
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: wp(55),
      height: hp(6),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      backgroundColor: theme.color.backgroundColor,
      borderColor: theme.color.backgroundColor,
      marginTop: hp(5),
    },
    modalButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textWhite,
    },
  });
  return styles;
};
export default createStyles;
