import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import UserCard from "../Home/UserCard";
import Post from "../Home/Post";
import Navbar from "../NavBar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  feedUserCommentUpdate,
  getFeedByIdStart,
  getUserFeedStart,
  userFeedLikeStatusUpdate,
} from "../../Store/slices/feedSlice";
import { getUserLikeListStart } from "../../Store/slices/userFeedLikeSlice";
import SnackBarAlert from "../utils/SnackBarAlert";
import MyPost from "../Home/MyPost";

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const isFirstRun = useRef(true);
  const {
    currentUserFeeds,
    currentUserFeedLoading: loading,
    currentUserFeedsError,
    userFeedHasMore: hasMore,
  } = useSelector((state) => state.feed);

  const [pageSize, setPageSize] = useState(1);

  useEffect(() => {
    if (hasMore) dispatch(getUserFeedStart({ userId, pageSize }));
  }, [dispatch, userId, pageSize, hasMore]);

  const getFeedHandler = () => getUserFeedStart(userId);
  const { error: userFeedLikeListError } = useSelector((state) => state.like);

  const { getFeedById: editPostDetails } = useSelector((state) => state.feed);

  const likeUpdate = (feedId, likeUpdate) =>
    userFeedLikeStatusUpdate(feedId, likeUpdate);

  const commentUpdate = (feedId, commentUpdate) =>
    feedUserCommentUpdate(feedId, commentUpdate);

  const [isEditPostEnable, setIsEditPostEnable] = useState(false);

  useEffect(() => {
    dispatch(getUserLikeListStart());
  }, [dispatch]);



  const scrollHandler = useCallback(async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
        //   &&
        // hasMore
      )
        setPageSize((state) => state + 1);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [scrollHandler]);

  const taggedPersonId = editPostDetails?.Tags?.map((tag) => tag?.userId);
  const taggedPersonName = editPostDetails?.Tags?.map((tag) => {
    return { ...tag?.taggedUserId, id: tag?.userId };
  });


  const getEditPostDetails = (feedId) => {
    dispatch(getFeedByIdStart({ feedId }));
  };

  useEffect(() => {
    if (!isFirstRun.current) {
      if (editPostDetails) setIsEditPostEnable(true);
    } else {
      isFirstRun.current = false;
    }
  }, [editPostDetails]);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={"flex"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={"26%"}>
          <UserCard />
          <Box m="2rem 0" />
        </Box>
        <Box flexBasis={"42%"}>
          {isEditPostEnable ? (
            <MyPost
              feedId={editPostDetails?.id}
              feedDescription={editPostDetails?.description}
              feedTags={editPostDetails?.Tags}
              feedImages={editPostDetails?.Images}
              taggedPersonIdList={taggedPersonId}
              taggedPersonName={taggedPersonName}
              isEditPostEnable={isEditPostEnable}
              setIsEditPostEnable={setIsEditPostEnable}
            />
          ) : (
            <Typography variant="h1">My Posts</Typography>
          )}
          <Box m="2rem 0" />

          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : currentUserFeeds?.length !== 0 ? (
            currentUserFeeds?.map((feed) => (
              <Post
                key={feed.id}
                feed={feed}
                getFeedHandler={getFeedHandler}
                isUserOwner={true}
                likeUpdate={likeUpdate}
                commentUpdate={commentUpdate}
                setIsEditPostEnable={setIsEditPostEnable}
                isEditPostEnable={isEditPostEnable}
                getEditPostDetails={getEditPostDetails}
              />
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Typography>You don't have any post</Typography>
            </Box>
          )}
        </Box>
      </Box>
      {userFeedLikeListError && (
        <SnackBarAlert errorMessage={userFeedLikeListError} />
      )}
      {currentUserFeedsError && (
        <SnackBarAlert errorMessage={currentUserFeedsError} />
      )}
    </Box>
  );
};

export default Profile;
