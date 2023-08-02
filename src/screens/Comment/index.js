import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import CommentsCard from '../../components/CommentsCard';
import CustomInputField from '../../components/CustomInputField';
import Text from '../../components/CustomText';
import {SendIcon} from '../../components/Icons/Icons';
import Header from '../../components/LoggedInHeader';
import DialogModal from '../../components/DialogModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/CustomButton';
import {
  delete_comments,
  get_memory,
  memory_comments_add,
} from '../../services/api-config';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {hp, wp} from '../../util';
import createStyles from './styles';

const Comment = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const time = moment().startOf('day').fromNow();
  const [isFetching, setIsFetching] = useState(true);
  const [getMemoryCall, getMemoryApiResponsee] = usePostApiMutation();
  const [deleteCommentCall, deleteCommentResponse] = usePostApiMutation();
  const [commentsList, setCommentsList] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [commentId, setCommentId] = useState();
  const userInfoToken = useSelector(state => state.user.userData.tokens.access);
  const userEmail = useSelector(state => state.user.userData.email);
  const [commentText, setCommentText] = useState();
  const route = useRoute();
  const {item} = route.params;

  useEffect(() => {
    getMemory();
  }, []);

  const getMemory = async () => {
    let data = {
      url: get_memory + `${item.id}/`,
      method: 'GET',
      token: userInfoToken,
    };
    try {
      let getMemoryResponsee = await getMemoryCall(data).unwrap();

      setCommentsList(getMemoryResponsee.comments);
      setIsFetching(false);
    } catch (e) {}
  };

  const postComments = async () => {
    let data = {
      memory: item.id,
      text: commentText,
    };
    let apiData = {
      url: memory_comments_add,
      method: 'POST',
      token: userInfoToken,
      data: data,
    };
    try {
      let getCommentsResponse = await getMemoryCall(apiData).unwrap();
      setIsFetching(false);
      getMemory();
    } catch (e) {}
  };

  const deleteComments = async id => {
    let apiData = {
      url: delete_comments + `${id}/`,
      method: 'DELETE',
      token: userInfoToken,
    };
    try {
      let deleteCommentsResponse = await deleteCommentCall(apiData).unwrap();
      setIsFetching(false);
      setDeleteModal(false);
      getMemory();
    } catch (e) {}
  };

  const renderComment = ({item}) => {
    const time = moment(item.created_on).format('DD MMM YYYY');
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.created_by != userEmail) {
            navigation.navigate('SharedMemories', {item: item});
          }
        }}>
        <CommentsCard
          img={item?.profile_pic_url}
          name={item.user_name}
          moment={time}
          comment={item.text}
          isCreatedByCurrentUser={item.created_by == userEmail}
          onPressDelete={() => {
            setDeleteModal(true);
            setCommentId(item.id);
          }}
          // onPressDelete={() => deleteComments(item?.id)}
        />
      </TouchableOpacity>
    );
  };

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        <Text style={styles.emptyMessageStyle}>No comments yet</Text>
      </View>
    );
  };

  const onRefresh = () => {
    // setIsFetching(true);
    getMemory();
  };

  const renderFooter = () => {
    return (
      getMemoryApiResponsee.isLoading && (
        <View style={styles.footer}>
          <ActivityIndicator color="pink" style={{}} />
        </View>
      )
    );
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
        <MaterialCommunityIcons
          name={'keyboard-backspace'}
          size={30}
          color={'black'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={styles.headerInitialText}>Comments</Text>
        <View style={{width: '15%'}}></View>
      </View>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
        <KeyboardAwareFlatList
          data={commentsList}
          renderItem={renderComment}
          contentContainerStyle={{flexGrow: 1}}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmptyContainer}
          refreshing={false}
          onRefresh={onRefresh}
          progressViewOffset={100}
          ListFooterComponent={renderFooter}
        />
        <View
          style={{
            alignSelf: 'center',
          }}>
          <CustomInputField
            inputStyle={styles.saveChangesButtonText}
            value={commentText}
            onChangeText={text => setCommentText(text)}
            inputContainer={{
              borderColor: 'white',
              borderWidth: hp(0.45),
              borderRadius: hp(3),
              paddingHorizontal: hp(2),
              backgroundColor: 'white',
              width: hp(45),
              height: hp(7),
              shadowColor: 'lighgray',
              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.4,
              shadowRadius: 3,
              elevation: 5,
            }}
            placeholder={'Write a comment'}
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  postComments();
                  setCommentText();
                }}>
                <SendIcon height={wp(6)} width={wp(6)} />
              </TouchableOpacity>
            }
          />
        </View>
      </KeyboardAwareScrollView>
      <DialogModal
        visible={deleteModal}
        dialogStyle={styles.modalStyle}
        onPress={() => setDeleteModal(false)}
        children={
          <View>
            <View style={styles.rowContainer}>
              <Text style={styles.modalHeader}>Delete Comment</Text>
              <TouchableOpacity
                onPress={() => {
                  setDeleteModal(false);
                }}
                style={styles.modalCloseIcon}>
                <Ionicons
                  name={'close-circle-outline'}
                  size={40}
                  color={'black'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Are you sure about this?</Text>
            <Text style={styles.modalText}>
              This comment will be gone and you won’t get it back
            </Text>
            <Button
              loading={deleteCommentResponse.isLoading}
              style={[styles.modalButton, styles.modalButtonText]}
              title1="Delete Comment"
              onPress={() => deleteComments(commentId)}
            />
          </View>
        }
      />
    </View>
  );
};

export default Comment;
