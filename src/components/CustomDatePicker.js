import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, {useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useThemeAwareObject} from '../theme/index';
import {hp, wp} from '../util';
import Text from './CustomText';

const CustomDatePicker = ({
  onChange,
  type,
  value,
  maxDate,
  minDate,
  customDateView,
  calendar,
  format,
  display,
  setCurrentDate,
}) => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      dateView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: theme.color.dividerColor,
        borderRadius: theme.borders.radius2,
        height: hp(6),
        paddingHorizontal: wp(3),
      },
      dateTimeColor: {
        marginLeft: wp(2),
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        fontWeight: 'bold',
      },
    });
    return themeStyles;
  };

  const styles = useThemeAwareObject(createStyles);
  const [date, setDate] = useState(moment(value));
  const [mode, setMode] = useState('');
  const [show, setShow] = useState(false);

  const _onChange = (event, value) => {
    if (event.type == 'dismissed') {
      setShow(Platform.OS === 'ios');
    } else {
      const currentDate = value;

      setShow(Platform.OS === 'ios');
      setDate(currentDate);
      setCurrentDate(currentDate);

      if (mode === 'time') {
        setCurrentDate(currentDate);

        //  onChange(moment(currentDate));
      }
      if (mode === 'date') {
        setCurrentDate(currentDate);

        // onChange(moment(currentDate));
      }
    }
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          type == 'date' ? showDatepicker() : showTimepicker();
        }}
        style={{paddingBottom: 10}}>
        <View style={[styles.dateView, customDateView]}>
          {/* <Calendar marginLeft={hp(-0.5)} /> */}
          <Text style={styles.dateTimeColor}>
            {type == 'date'
              ? moment(new Date(value)).format('LL')
              : moment(date).format('hh:mm')}
          </Text>
          <MaterialCommunityIcons
            name={'calendar-month-outline'}
            size={30}
            color={'black'}
          />
        </View>
      </TouchableOpacity>
      {show && Platform.OS != 'ios' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(value)}
          mode={mode}
          is24Hour={false}
          display={display}
          onChange={_onChange}
          maximumDate={maxDate}
          minimumDate={minDate}
        />
      )}
      {show && Platform.OS == 'ios' && (
        <ReactNativeModal
          isVisible={show}
          onBackButtonPress={() => {
            setShow(false);
          }}
          onBackdropPress={() => {
            setShow(false);
          }}
          onRequestClose={() => {
            setShow(false);
          }}
          hasBackdrop
          backdropOpacity={0.5}
          backdropColor="#000">
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 10,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 0},
              shadowOpacity: 0.5,
              paddingBottom: 20,
            }}>
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(value)}
              mode={mode}
              is24Hour={false}
              display={'spinner'}
              onChange={_onChange}
              maximumDate={maxDate}
              minimumDate={minDate}
              themeVariant={'light'}
            />
          </View>
        </ReactNativeModal>
      )}
    </>
  );
};

export default CustomDatePicker;
