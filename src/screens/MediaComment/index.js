import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
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
import DialogModal from '../../components/DialogModal';
import {SendIcon} from '../../components/Icons/Icons';
import Header from '../../components/LoggedInHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/CustomButton';
import {
  delete_comments,
  get_media_comments,
  post_media_comments,
} from '../../services/api-config';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import {hp, wp} from '../../util';
import createStyles from './styles';

const MediaComment = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const [isFetching, setIsFetching] = useState(true);
  const [getMediaCommentsCall, getMediaCommentsApiResponse] =
    usePostApiMutation();
  const [deleteCommentCall, deleteCommentResponse] = usePostApiMutation();
  const [commentsList, setCommentsList] = useState([]);
  const userInfoToken = useSelector(state => state.user.userData.tokens.access);
  const [commentText, setCommentText] = useState();
  const [page, setPage] = useState(1);
  const [isMoreComments, setIsMoreComments] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [commentId, setCommentId] = useState();
  const userEmail = useSelector(state => state.user.userData.email);

  const route = useRoute();
  const {item, mediaList} = route.params;

  useEffect(() => {
    getMediaComments(1);
    // onRefresh();
  }, []);

  const getMediaComments = async page => {
    setIsMoreComments(false);
    let data = {
      url: get_media_comments + `${item.id}/` + `?page=${page}`,
      method: 'GET',
      token: userInfoToken,
    };
    try {
      let getMediaCommentsResponse = await getMediaCommentsCall(data).unwrap();

      if (
        getMediaCommentsResponse.comments_list &&
        getMediaCommentsResponse.comments_list.length == 10
      ) {
        setIsMoreComments(true);
      }

      if (page == 1) {
        setCommentsList([...getMediaCommentsResponse.comments_list]);
      } else {
        setCommentsList([
          ...commentsList,
          ...getMediaCommentsResponse.comments_list,
        ]);
      }
      // setIsFetching(false);
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
      getMediaComments(1);
      setIsFetching(false);
      setDeleteModal(false);
    } catch (e) {}
  };
  const postComments = async () => {
    let data = {
      media: item.id,
      text: commentText,
    };
    let apiData = {
      url: post_media_comments,
      method: 'POST',
      token: userInfoToken,
      data: data,
    };
    try {
      let getCommentsResponse = await getMediaCommentsCall(apiData).unwrap();
      setIsFetching(false);
      getMediaComments(1);
    } catch (e) {}
  };

  const renderComment = item => {
    const time = moment(item.created_on).format('DD MMM YYYY');
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.created_by != userEmail) {
            navigation.navigate('SharedMemories', {item: item});
          } else {
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
    getMediaComments(1);
    setPage(1);
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
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
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            if (isMoreComments) {
              let tempPage = page + 1;
              setPage(tempPage);
              getMediaComments(tempPage);
            }
          }
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
        scrollEventThrottle={400}>
        <View>{commentsList.map(item => renderComment(item))}</View>
        <View>
          {getMediaCommentsApiResponse.isLoading ? (
            <View style={styles.footer}>
              <ActivityIndicator color="pink" style={{}} />
            </View>
          ) : null}
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
        </View>
      </KeyboardAwareScrollView>

      {/* <KeyboardAwareFlatList
        data={commentsList}
        renderItem={renderComment}
        contentContainerStyle={{flexGrow: 1}}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmptyContainer}
        refreshing={false}
        onRefresh={onRefresh}
        progressViewOffset={100}
        ListFooterComponent={
          <>
            {getMediaCommentsApiResponse.isLoading ? (
              <View style={styles.footer}>
                <ActivityIndicator color="pink" style={{}} />
              </View>
            ) : null}
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
          </>
        }
        ListFooterComponentStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
        onEndReachedThreshold={0.01}
        onEndReached={() => {
          if (isMoreComments) {
            let tempPage = page + 1;
            setPage(tempPage);
            getMediaComments(tempPage);
          }
        }}
      /> */}
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
                  color="grey"
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

export default MediaComment;
