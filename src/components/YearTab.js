import React from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import DateScroller from './Icons/DateScroller';

export default function YearTab(props) {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      backgroundColor: {
        backgroundColor: theme.color.headerBackgroundColor,
      },
      sideContainerStyle: {
        marginHorizontal: wp(2),
      },
      tabContainer: {
        justifyContent: 'center',
        width: wp(15),
        height: hp(70),
        position: 'absolute',
        top: hp(25),
        right: 0,
      },
      tabitem: {
        backgroundColor: theme.color.tabColor,
        borderTopLeftRadius: theme.borders.radius3,
        borderBottomStartRadius: theme.borders.radius3,
        padding: 1,
        height: hp(12),
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabInactiveitem: {
        // backgroundColor: '#1f247a',
        padding: 5,
        height: hp(12),
        justifyContent: 'center',
        alignItems: 'center',
      },
      edgeStyle: {
        width: 140,
        height: 0,
        borderTopWidth: 0,
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderLeftWidth: 30,

        borderRightColor: 'transparent',
        borderRightWidth: 30,
        borderBottomColor: theme.color.tabColor,
        borderBottomWidth: 30,
        transform: [{rotate: '270deg'}],
        position: 'absolute',
        left: -10,
      },
      tabtitle: {
        color: theme.color.textWhite,
        fontWeight: 'bold',
        fontSize: 16,
        transform: [{rotate: '270deg'}],
      },
      tabInactive: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        transform: [{rotate: '270deg'}],
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  const YEAR = [
    {id: 1, year: '2022'},
    {id: 2, year: '2021'},
    {id: 3, year: '2020'},
    {id: 4, year: '2019'},
  ];
  // const [selectedTab, setSelectedTab] = React.useState(0);
  const YearItem = props => (
    <View>
      <DateScroller
        onPressSvg={() => {
          props.setSelectedTab(props.index);
        }}
        fillSvg={props.selectedTab == props.index ? '#021639' : 'white'}
        fillSvgText={props.selectedTab == props.index ? 'white' : 'black'}
        text={props.years}
      />
    </View>
  );

  const renderItem = ({item, index}) => {
    return (
      <YearItem
        years={item}
        index={index}
        selectedTab={props.selectedTab}
        setSelectedTab={props.setSelectedTab}
      />
    );
  };
  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={props.years}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
