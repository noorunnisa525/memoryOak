import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '../../components/CustomAvatar';
import Button from '../../components/CustomButton';
import Text from '../../components/CustomText';
import DialogModal from '../../components/DialogModal';
import avatar from '../../components/ImagePicker/Icons/avatar-placeholder.jpg';
import Header from '../../components/LoggedInHeader';
import SearcBar from '../../components/SearchBar';
import {logOut} from '../../redux/slices/userSlice';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';

function Home({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [profileModal, toggleModal] = useState(false);
  const EditPic = useSelector(state => state?.user?.user?.profile_pic_url);

  const dispatch = useDispatch();
  const clearState = () => {
    toggleModal(!profileModal);
  };
  const signOut = async () => {
    try {
      clearState();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      dispatch(logOut(false));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'light-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
      />
      <View style={styles.subContainer}>
        <Text style={styles.headerInitialText}>
          Memory <Text style={styles.headerLastText}>Oak</Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            toggleModal(true);
          }}>
          <Avatar
            rounded
            image={EditPic ? EditPic : avatar}
            size="large"
            avatarContainer={styles.avatarImage}
            onPressAvatar={() => {
              toggleModal(true);
            }}
          />
        </TouchableOpacity>
      </View>
      <SearcBar placeholder="Search your memories" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View style={styles.memoryContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreateMemory');
            }}>
            <Ionicons
              name={'add-circle'}
              size={50}
              color={styles.addMemoryIcon}
            />
          </TouchableOpacity>
          <Text style={styles.firstMemoryText}>Create Your First Memory</Text>
        </View>
        <DialogModal
          visible={profileModal}
          dialogStyle={styles.dialogStyle}
          onPress={() => toggleModal(false)}
          children={
            <>
              <TouchableOpacity
                onPress={() => {
                  toggleModal(false);
                }}
                style={styles.modalCloseIcon}>
                <Ionicons
                  name={'close-circle-outline'}
                  size={40}
                  color="grey"
                />
              </TouchableOpacity>
              <View style={styles.modalContentContainer}>
                <Avatar
                  rounded
                  image={EditPic ? EditPic : avatar}
                  size="large"
                  avatarContainer={styles.profileImage}
                  onPressAvatar={() => {
                    toggleModal(true);
                  }}
                />
                <Button
                  style={[styles.profileButton, styles.newMemoryButtonText]}
                  title1="Edit Account "
                  onPress={() => {
                    navigation.navigate('EditProfileScreen'), clearState();
                  }}
                />
                <Button
                  style={[styles.profileButton, styles.newMemoryButtonText]}
                  title1="Membership"
                  onPress={() => {
                    navigation.navigate('MemberShip'), clearState();
                  }}
                />
                <Button
                  style={[styles.profileButton, styles.newMemoryButtonText]}
                  title1="Logout"
                  onPress={signOut}
                />
              </View>
            </>
          }
          contentStyle={styles.contentStyle}
        />
        <Button
          style={[styles.newMemoryButton, styles.newMemoryButtonText]}
          title1="New Memory "
          onPress={() => {
            navigation.navigate('NewMemory');
          }}
        />
      </ScrollView>
    </View>
  );
}

export default Home;
