import React, {useState} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useThemeAwareObject} from '../theme';

const SearchBar = props => {
  const [query, setQuery] = useState('');

  const onChangeText = text => {
    setQuery(text);
    // const list = playList?.filter(val => {
    //   return val.name.toLowerCase().includes(text.toLowerCase());
    // });
    // props.setUpdatedPlaylist(list);
  };
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      container: {
        height: hp('7'),
        width: wp('85'),
        flexDirection: 'row',
        alignSelf: 'center',
        borderRadius: theme.borders.radius4,
        backgroundColor: theme.color.textWhite,
        borderColor: theme.color.textWhite,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: {width: 1, height: 3},
            shadowOpacity: 0.2,
          },
          android: {
            elevation: 0.5,
          },
        }),

        marginTop: '-8%',
      },
      label: {
        fontSize: hp('3%'),
        fontWeight: 'bold',
      },

      container2: {
        backgroundColor: theme.color.background,
        borderRadius: 10,
        justifyContent: 'center',
        paddingLeft: wp(5),
      },
      txt: {
        padding: 5,
        color: theme.color.textBlack,
        fontSize: hp('2%'),
      },
      Searchtxt: {
        padding: 5,
        color: theme.color.background,
        fontSize: hp('2%'),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Ionicons name={'search-outline'} size={wp(5)} />
      </View>

      {props.onFocus ? (
        <TouchableOpacity
          onPress={props.onFocus}
          style={{flex: 4, justifyContent: 'center', padding: 5}}>
          <Text style={styles.txt}>{props.placeholder}</Text>
        </TouchableOpacity>
      ) : (
        <View style={{flex: 4, justifyContent: 'center'}}>
          <TextInput
            style={styles.txt}
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
            placeholderTextColor={styles.txt.color}
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;
