import React from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';

function Social({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.socialContainer}>
      <SocialIcon
        iconSize={styles.iconSize}
        iconColor={styles.iconColor}
        button={TouchableOpacity}
        title="Login with Google"
        onPress={() => navigation.navigate('NewMemory')}
        style={styles.socialIcons}
        fontStyle={styles.iconText}
        raised={false}
        type="google"
      />
      <SocialIcon
        fontFamily={'Quicksand-Bold'}
        iconSize={styles.iconSize}
        iconColor={styles.iconColor}
        button={TouchableOpacity}
        title="Login with Facebook"
        onPress={() => navigation.navigate('NewMemory')}
        style={styles.socialIcons}
        raised={false}
        fontStyle={styles.iconText}
        type="facebook"
      />
      {Platform.OS == 'ios' && (
        <SocialIcon
          iconSize={styles.iconSize}
          iconColor={styles.iconColor}
          button={TouchableOpacity}
          title="Login with APple"
          onPress={() => console.log('apple')}
          style={styles.socialIcons}
          fontStyle={styles.iconText}
          raised={false}
          type="apple"
        />
      )}
    </View>
  );
}

export default Social;
