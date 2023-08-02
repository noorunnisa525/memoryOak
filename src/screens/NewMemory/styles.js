import {StyleSheet, Dimensions} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.textWhite,
      flexGrow: 1,
    },
    subContainer: {
      height: hp(13),
      backgroundColor: theme.color.headerBackgroundColor,
      borderBottomLeftRadius: hp(5),
      borderBottomRightRadius: hp(5),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: hp(7),
    },
    headerInitialText: {
      paddingLeft: hp(3.5),
      fontSize: theme.size.large,
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    headerLastText: {
      fontSize: theme.size.large,
      color: theme.color.backgroundColor,
      textAlign: 'center',
      fontFamily: theme.fontFamily.boldFamily,
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.headerBackgroundColor,
    },
    memoryContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: wp(0.5),
      width: wp(75),
      height: hp(20),
      borderRadius: theme.borders.radius3,
      borderColor: theme.color.headerBackgroundColor,
      // padding: hp(2),
      // marginBottom: hp(12),
    },
    headerColor: theme.color.headerBackgroundColor,
    addMemoryIcon: theme.color.backgroundColor,
    container: {
      flexGrow: 1,
      paddingLeft: hp(3),
      marginTop: hp(3),
      paddingBottom: hp(30),
      justifyContent: 'space-between',
    },
    memoriesContainer: {
      flexGrow: 1,
      paddingLeft: hp(2),
      marginTop: hp(3),
      paddingBottom: hp(12),
      justifyContent: 'space-between',
      width: wp(85),
    },

    homeText: {
      fontSize: theme.size.large,
    },

    memoryDetailsCard: {
      height: hp(13),
      width: wp(33),
      // borderRadius: hp(15),
      // padding: 20,
    },

    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginTop: hp(30),
    },

    emptyText: {fontSize: theme.size.medium},

    createContainer: {
      flexGrow: 1,
      paddingHorizontal: hp(5),
      paddingTop: hp(10),
      paddingBottom: hp(3),
      marginTop: hp(3),
      justifyContent: 'space-between',
    },

    firstMemoryText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      padding: hp(2),
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
      // backgroundColor: theme.color.textWhite,
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: {height: 1, width: 1}, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      backgroundColor: '#fff',
      elevation: 2, // Android
      marginBottom: hp(5),
    },
    newMemoryButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
    },
    avatarImage: {
      marginRight: wp(5),
      height: wp(14),
      width: wp(14),
      borderRadius: theme.borders.radius3,
    },

    profileImage: {
      marginBottom: hp(2),
      marginTop: -hp(3),
      height: wp(23),
      width: wp(23),
      borderRadius: theme.borders.radius4,
    },

    dialogStyle: {
      backgroundColor: 'white',
      // height: hp(43),
      width: wp(60),
      alignSelf: 'center',
    },
    logoutModalStyle: {
      backgroundColor: 'white',
      width: wp(70),
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
    expireButton: {
      margin: hp(1),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      width: wp(40),
      height: hp(6),
      borderRadius: hp(5),
      backgroundColor: theme.color.backgroundColor,
    },
    modalCloseIcon: {justifyContent: 'flex-end', alignSelf: 'flex-end'},
    modalContentContainer: {
      justifyContent: 'space-between',
      justifyContent: 'center',
      alignItems: 'center',
    },
    // <---------------------SectionListStyles------------------------------>
    sectionHeaderStyle: {
      padding: 5,
      color: theme.color.textBlack,
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
    },
    // sectionListItemStyle: {
    //   fontSize: 15,
    //   padding: 15,
    //   color: theme.color.textBlack,
    //   backgroundColor: '#F5F5F5',
    // },
    // listItemSeparatorStyle: {
    //   height: 0.5,
    //   width: '100%',
    //   backgroundColor: '#C8C8C8',
    // },
    overlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borders.radius3,
    },
    moreText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      textAlign: 'center',
      color: theme.color.textWhite,
    },
    firstMemoryText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      padding: hp(2),
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
    expiryText: {
      textAlign: 'center',
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.mediumFamily,
    },
    expireBtnText: {
      color: theme.color.textWhite,
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.mediumFamily,
    },
  });
  return styles;
};
export default createStyles;
