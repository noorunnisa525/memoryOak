import {StyleSheet, Dimensions} from 'react-native';
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
      fontSize: hp(3),
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },
    headerDate: {
      fontSize: theme.size.small,
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },
    uploadingText: {
      fontSize: theme.size.small,
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
      textAlign: 'center',
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
      fontFamily: theme.fontFamily.boldFamily,
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.headerBackgroundColor,
    },
    headerColor: theme.color.headerBackgroundColor,
    addMemoryIcon: theme.color.backgroundColor,

    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(1),
    },

    footer: {
      paddingVertical: hp(3),
      paddingHorizontal: wp(5),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },

    flatListStyle: {
      alignSelf: 'center',
    },

    homeText: {
      fontSize: theme.size.large,
    },

    newMemoryButton: {
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      // padding: hp(2.75),
      width: wp(50),
      height: hp(7.5),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      borderColor: theme.color.headerBackgroundColor,
      backgroundColor: theme.color.textWhite,
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: {height: 1, width: 1}, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 2, // Android
      marginBottom: hp(5),
      zIndex: 13213,
    },

    newMemoryButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
    },
    buyBtn: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      width: wp(50),
      height: hp(7.5),
      borderRadius: hp(5),
      backgroundColor: theme.color.backgroundColor,
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: {height: 1, width: 1}, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 2, // Android
      zIndex: 13213,
    },

    buyText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textWhite,
    },
    avatarImage: {marginRight: wp(5)},

    profileImage: {
      marginBottom: hp(3),
    },
    firstMemoryText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      padding: hp(2),
    },

    divider: {
      marginTop: hp(5),
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
    memoryContainer: {
      alignSelf: 'center',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: hp(21),
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp(4),
      marginHorizontal: wp(4),
      width: wp(40),
      height: hp(8),
      borderRadius: hp(2),
      marginBottom: hp(2),
      backgroundColor: theme.color.textWhite,
      shadowColor: theme.color.dividerColor,
      shadowOffset: {width: 1, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 5,
    },
    socialText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      marginLeft: wp(2),
    },
    cardText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
    },
    iconHeaderContainer: {
      width: '100%',
      paddingLeft: hp(1),
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    headerTitleContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },
    subsubContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
    },
    memoryDetailsCard: {
      height: hp(25),
      width: wp(43.5),
    },

    emptyListStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(20),
    },

    emptyMessageStyle: {
      textAlign: 'center',
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.mediumFamily,
    },

    dialogStyle: {
      backgroundColor: 'white',
      height: hp(50),
      width: wp(80),
      alignSelf: 'center',
    },

    progressDialogStyle: {
      backgroundColor: 'white',
      padding: hp(2),
    },
    progressBarStyle: {
      marginVertical: hp(2),
    },
    contentStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    modalHeader: {
      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: hp(1),
    },
    modalCloseIcon: {
      // justifyContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    iconSize: hp(3),
    textFieldTile: {
      fontSize: hp(3),

      textAlign: 'center',
      fontFamily: theme.fontFamily.boldFamily,
    },
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
    modalButton: {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: wp(42),
      height: hp(7),
      borderRadius: hp(5),
      backgroundColor: theme.color.backgroundColor,
      marginBottom: hp(2),
    },

    modalButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textWhite,
    },
    saveChangesButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      borderBottomColor: 'white',
    },
    inputContainerStyle: {
      width: wp(70),
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
    commentIcon: {
      backgroundColor: '#FDF2FB',
      borderRadius: 15,
      alignItems: 'center',
      paddingBottom: 5,
    },
    happyModal: {
      backgroundColor: 'white',
      alignSelf: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: hp(3),
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
      marginBottom: hp(3),
    },
  });
  return styles;
};
export default createStyles;
