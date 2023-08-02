import React from 'react';
import {TouchableOpacity} from 'react-native';
import Svg, {Path, Text} from 'react-native-svg';
import {hp, wp} from '../../util';
const DateScroller = ({color, ...props}) => (
  <TouchableOpacity onPress={props.onPressSvg}>
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="62.025"
      height="105.234"
      viewBox="0 0 54.025 106.234">
      <Path
        id="Subtraction_3"
        data-name="Subtraction 3"
        d="M54.023,150.824a11.793,11.793,0,0,0-2.421-3.4c-3.307-3.269-8.719-5.233-16.086-5.837a138.731,138.731,0,0,1-13.855-1.7,43.055,43.055,0,0,1-10.31-3.049,18.162,18.162,0,0,1-6.838-5.195,17.95,17.95,0,0,1-3.443-8.134C.269,119.048-.085,110.346.017,97.65c-.1-12.637.256-21.3,1.056-25.751a17.947,17.947,0,0,1,3.443-8.134,18.166,18.166,0,0,1,6.839-5.195,43.068,43.068,0,0,1,10.309-3.049,138.782,138.782,0,0,1,13.856-1.7c7.365-.6,12.777-2.567,16.086-5.837a11.794,11.794,0,0,0,2.421-3.4V150.824Z"
        transform="translate(0 -44.59)"
        fill={props.fillSvg}
      />

      <Text
        x={-wp(15)}
        y={hp(5)}
        textAnchor="middle"
        fill={props.fillSvgText}
        fontWeight={'bold'}
        fontSize={hp(2)}
        transform="rotate(-90)">
        {props.text}
      </Text>
    </Svg>
  </TouchableOpacity>
);

export default DateScroller;
