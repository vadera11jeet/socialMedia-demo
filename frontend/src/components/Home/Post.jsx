import React, { useEffect, useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  Delete,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  Send,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import Wrapper from "../utils/Wrapper";
import FlexBetween from "../utils/FlexBetween";
import {
  createCommentStart,
  deleteCommentStart,
} from "../../Store/slices/commentSlice";
import {
  deleteFeedStart,
  getFeedByIdStart,
} from "../../Store/slices/feedSlice";
import {
  getFeedUserLikeListStart,
  toggleLikeStart,
} from "../../Store/slices/userFeedLikeSlice";
import SnackBarAlert from "../utils/SnackBarAlert";
import ConfirmAlert from "../utils/ConfirmAlert";

const Post = ({
  feed,
  isEditPostEnable,
  isUserOwner,
  likeUpdate,
  commentUpdate,
}) => {
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [isCommentEmpty, setIsCommentEmpty] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLikedUserListShow, setIsLikedUserListShow] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const { palette } = useTheme();
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedUserLikeListStart(feed?.id));
    // eslint-disable-next-line
  }, []);

  const { loading, deleteCommentLoading, deleteCommentError } = useSelector(
    (state) => state.comment
  );
  const {
    loading: userLikeListLoading,
    error: userLikeError,
    feedUserLikeList,
  } = useSelector((state) => state.like);

  const medium = palette.neutral.medium;
  const { deleteFeedLoading, deleteFeedError } = useSelector((state) => {
    return state.feed;
  });
  const user = useSelector((state) => state.auth.user);
  const primary = palette.primary.main;

  const commentPostHandler = () => {
    if (!commentText) setIsCommentEmpty(true);
    dispatch(
      createCommentStart({
        feedId: feed?.id,
        body: { commentText: commentText },
        cb: commentUpdate,
      })
    );
    setCommentText("");
  };

  return (
    <Wrapper>
      <FlexBetween>
        <FlexBetween gap="1rem">
          <FlexBetween
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <Box>
              <Typography
                color={main}
                variant="h5"
                fontWeight="500"
                sx={{
                  "&:hover": {
                    color: palette.primary.light,
                    cursor: "pointer",
                  },
                }}
              >
                {`${feed?.user?.firstName} ${feed?.user?.lastName}`}
              </Typography>
            </Box>

            {isUserOwner && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <IconButton
                  disableRipple={true}
                  disabled={deleteFeedLoading}
                  onClick={() => {
                    setIsDialogOpen(true);
                  }}
                >
                  <Delete />
                </IconButton>
                <IconButton
                  disableRipple={true}
                  onClick={() => {
                    dispatch(getFeedByIdStart({ feedId: feed?.id }));
                  }}
                  disabled={isEditPostEnable}
                >
                  <CreateIcon />
                </IconButton>
              </Box>
            )}
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>
      <Typography color={main} sx={{ mt: "1rem" }}>
        {feed?.description}
      </Typography>
      {feed?.Tags?.length !== 0 && (
        <Stack direction="row">
          <Typography color={primaryDark} sx={{ mt: "1rem" }}>
            {"Tagged User "}
          </Typography>
          {feed?.Tags?.map((taggedUser, index) => (
            <Typography
              color={medium}
              sx={{ ml: "1rem", mt: "1rem" }}
              key={index}
            >{`${taggedUser?.taggedUserId?.firstName} ${taggedUser?.taggedUserId?.lastName}`}</Typography>
          ))}
        </Stack>
      )}
      {feed?.Images?.length !== 0 && (
        <Carousel showArrows={true} showThumbs={false}>
          {feed?.Images?.map((image, index) => {
            return (
              <Box key={index}>
                <img
                  width="100%"
                  height="auto"
                  alt="post"
                  src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${image?.image}`}
                  style={{ borderRadius: " 0.75rem", marginTop: "0.75rem" }}
                />
              </Box>
            );
          })}
        </Carousel>
      )}

      <FlexBetween
        mt="0.25rem"
        sx={{ width: "100%", justifyContent: "space-between" }}
      >
        <Box
          display="flex"
          sx={{ alignItems: "space-between", flexDirection: "row" }}
        >
          <Box display="flex" alignItems="space-around" flexDirection="row">
            <FlexBetween gap="0.3rem">
              <IconButton
                disabled={userLikeListLoading}
                onClick={() => {
                  dispatch(
                    toggleLikeStart({ feedId: feed?.id, cb: likeUpdate })
                  );
                }}
              >
                {feed?.Likes?.some((like) => like.userId === user.id) ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>

              <Typography>{feed?.Likes?.length}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem" pl={"0.5rem"}>
              <IconButton
                onClick={() => {
                  setIsCommentVisible((state) => !state);
                  if (isLikedUserListShow) setIsLikedUserListShow(false);
                }}
              >
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{feed?.Comments?.length}</Typography>
            </FlexBetween>
          </Box>
        </Box>
        <FlexBetween>
          {feed?.Likes?.length !== 0 && (
            <Button
              disableRipple={true}
              variant="text"
              onClick={() => {
                dispatch(getFeedUserLikeListStart(feed?.id));
                setIsLikedUserListShow((state) => !state);
                if (isCommentVisible) setIsCommentVisible(false);
              }}
            >
              List all liked user
            </Button>
          )}
        </FlexBetween>
      </FlexBetween>

      {isLikedUserListShow && feed?.Likes?.length !== 0 && (
        <Box sx={{ overflow: "hidden", overflowY: "scroll", height: "70px" }}>
          {feedUserLikeList?.map((user, i) => (
            <Box key={`${i}`}>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "Row",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    color={medium}
                    sx={{ ml: "1rem", mt: "0.5rem" }}
                  >{`${user?.user?.firstName} ${user?.user?.lastName}`}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {isCommentVisible && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InputBase
            placeholder="add comment..."
            sx={{
              width: "90%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              pl: "2rem",
            }}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            error={isCommentEmpty}
          />
          <IconButton
            type="button"
            disabled={loading}
            onClick={commentPostHandler}
          >
            <Send />
          </IconButton>
        </Box>
      )}

      {feed?.Comments?.length !== 0 && isCommentVisible && (
        <>
          <Box mt="0.5rem">
            {feed?.Comments?.map((comment, i) => (
              <Box key={`${i}`}>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "Row",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      color={medium}
                      sx={{ ml: "1rem", mt: "0.5rem" }}
                    >{`${comment?.commentedUserId?.firstName} ${comment?.commentedUserId?.lastName}`}</Typography>
                    <Typography
                      sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}
                      key={comment?.id}
                    >
                      {comment?.commentText}
                    </Typography>
                  </Box>
                  {user.id === comment.userId && (
                    <IconButton
                      disableRipple={true}
                      disabled={deleteCommentLoading}
                      onClick={() => {
                        setIsCommentDialogOpen(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
                <ConfirmAlert
                  isDialogOpen={isCommentDialogOpen}
                  setIsDialogOpen={setIsCommentDialogOpen}
                  dialogText="Are you sure you want to delete comment ?"
                  oncloseHandler={() => setIsCommentDialogOpen(false)}
                  onAgreeAction={() => {
                    dispatch(
                      deleteCommentStart({
                        commentId: comment?.id,
                        cb: commentUpdate,
                        feedId: feed?.id,
                      })
                    );
                    setIsCommentDialogOpen(false);
                  }}
                />
              </Box>
            ))}
          </Box>
        </>
      )}
      {userLikeError ?? <SnackBarAlert errorMessage={userLikeError} />}
      {deleteCommentError ?? (
        <SnackBarAlert errorMessage={deleteCommentError} />
      )}
      {deleteFeedError && <SnackBarAlert errorMessage={deleteFeedError} />}

      <ConfirmAlert
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        dialogTitle="Are you sure to perform this action ?"
        oncloseHandler={() => setIsDialogOpen(false)}
        onAgreeAction={() => dispatch(deleteFeedStart({ feedId: feed?.id }))}
        dialogText="do you confirm to delete this feed ?"
      />
    </Wrapper>
  );
};

export default React.memo(Post);
