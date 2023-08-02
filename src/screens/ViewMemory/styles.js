import {StyleSheet, Dimensions} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.textWhite,
    },

    headerInitialText: {
      // paddingLeft: hp(2.5),
      paddingRight: hp(10),
      alignSelf: 'center',
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
      fontSize: theme.size.xLarge,
      color: theme.color.backgroundColor,
      textAlign: 'center',
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.textBlack,
    },
    headerStatusbar: {
      backgroundColor: theme.color.textBlack,
    },
    headerColor: theme.color.textBlack,
    addMemoryIcon: theme.color.backgroundColor,
    container: {
      flexGrow: 1,
      paddingTop: hp(1),
      paddingBottom: hp(3),
      justifyContent: 'space-between',
      backgroundColor: 'red',
    },
    homeText: {
      fontSize: theme.size.large,
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
      width: wp(70),
      height: hp(40),
      alignSelf: 'center',
    },
    saveDialogStyle: {
      backgroundColor: 'white',
      height: hp(15),
      width: wp(70),
      alignSelf: 'center',
    },
    contentStyle: {
      justifyContent: 'center',
      alignItems: 'center',
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
      borderRadius: 10,
      marginTop: hp(9),
      margin: hp(1.5),
      position: 'absolute',
      // justifyContent: 'center',
      // alignItems: 'center',
      padding: hp(0.75),
      zIndex: 3, // works on ios
      backgroundColor: theme.color.overlay,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      position: 'absolute',
    },
    StyleOfItemsContainerForFlatList: {
      flex: 1,
      height: hp(100),
      width: wp(100),
      justifyContent: 'center',
      alignItems: 'center',
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
      marginTop: hp(1),
    },
    modalButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textWhite,
    },
    modalCloseIcon: {justifyContent: 'flex-end', alignSelf: 'flex-end'},
    textFieldTile: {
      marginTop: -hp(3),
      fontSize: theme.size.medium,
      textAlign: 'center',
      fontFamily: theme.fontFamily.boldFamily,
    },
    fieldText: {
      fontSize: theme.size.medium,
      textAlign: 'center',
      fontFamily: theme.fontFamily.mediumFamily,
      marginBottom: hp(2),
    },
    itemWrapper: {
      width: windowWidth,
      heigth: windowHeight,
    },
  });
  return styles;
};
export default createStyles;
