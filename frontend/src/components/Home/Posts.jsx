import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import {
  getAllFeedStart,
  feedLikeStatusUpdate,
  feedCommentUpdate,
  addNewFeed,
} from "../../Store/slices/feedSlice";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import SnackBarAlert from "../utils/SnackBarAlert";
import socket from "../../socket";

const Posts = () => {
  const dispatch = useDispatch();
  const {
    feeds: feedLists,
    loading,
    error: getFeedError,
    feedHasMore: hasMore,
  } = useSelector((state) => {
    return state.feed;
  });

  const [pageSize, setPageSize] = useState(1);

  const { userFeedLikeList, error: userFeedLikeListError } = useSelector(
    (state) => state.like
  );

  useEffect(() => {
    if (hasMore) dispatch(getAllFeedStart(pageSize));
  }, [dispatch, pageSize, hasMore]);

  useEffect(() => {
    const createFeedListener = (feed) => {
      dispatch(addNewFeed(feed));
    };
    if (!socket.connected) socket.connect();
    socket.on("createdFeed", createFeedListener);

    return () => {
      socket.off("createdFeed", createFeedListener);
    };
  }, [dispatch]);

  const scrollHandler = useCallback(async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight &&
        hasMore
      ) {
        setPageSize((state) => state + 1);
      }
    } catch (err) {
      console.log(err);
    }
  }, [hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [scrollHandler]);

  const likeUpdate = (feedId, likeUpdate) =>
    feedLikeStatusUpdate(feedId, likeUpdate);

  const commentUpdate = (feedId, commentUpdate) =>
    feedCommentUpdate(feedId, commentUpdate);

  const getFeedHandler = () => getAllFeedStart();

  return (
    <>
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
      ) : feedLists?.length ? (
        feedLists?.map((feed) => (
          <Fragment key={feed.id}>
            <Post
              // key={feed.id}
              feed={feed}
              getFeedHandler={getFeedHandler}
              userLikeList={userFeedLikeList}
              likeUpdate={likeUpdate}
              commentUpdate={commentUpdate}
            />
            <Divider />
          </Fragment>
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
          <Typography>Be the first one to post</Typography>
        </Box>
      )}
      {getFeedError && <SnackBarAlert errorMessage={getFeedError} />}
      {userFeedLikeListError && (
        <SnackBarAlert errorMessage={userFeedLikeListError} />
      )}
    </>
  );
};

export default Posts;
