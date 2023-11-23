import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  AttachFileOutlined,
  ImageOutlined,
  MicOutlined,
} from "@mui/icons-material";

import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Dropzone from "react-dropzone";
import Wrapper from "../utils/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import FlexBetween from "../utils/FlexBetween";
import MultipleSelectChip from "../utils/MultiSelectChip";
import { getAllUserStart } from "../../Store/slices/userDetailsSlice";
import {
  createdFeedStart,
  resetFeed,
  updateFeedImage,
  updateFeedStart,
} from "../../Store/slices/feedSlice";
import SnackBarAlert from "../utils/SnackBarAlert";
import { deleteImageStart } from "../../Store/slices/imageSlice";

const MyPost = ({
  feedId,
  feedDescription,
  taggedPersonIdList,
  taggedPersonName,
  feedImages,
  isEditPostEnable,
  setIsEditPostEnable,
}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const [isImage, setIsImage] = useState(feedImages?.length ? true : false);
  const [images, setImages] = useState(feedImages ? feedImages : []);
  const [description, setDescription] = useState(
    feedDescription ? feedDescription : ""
  );

  const { users: userList, error: userListError } = useSelector(
    (state) => state.userDetail
  );
  const { creationLoading, createdFeedError } = useSelector(
    (state) => state.feed
  );
  const [personName, setPersonName] = useState(
    taggedPersonName ? taggedPersonName : []
  );

  const [taggedPersonId, setTaggedPersonId] = useState(taggedPersonIdList);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handleImageDelete = (index, imageId) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    dispatch(deleteImageStart(imageId));
    dispatch(updateFeedImage(updatedImages));
    setImages(updatedImages);
  };

  useEffect(() => {
    dispatch(getAllUserStart());
  }, [dispatch]);

  const createPostHandler = () => {
    if (!description) {
      return;
    }
    const feedData = new FormData();

    feedData.append("description", description);
    images.forEach((image) => feedData.append("image", image));
    if (taggedPersonId.length) {
      taggedPersonId.forEach((taggedPerson) =>
        feedData.append("taggedUserList", taggedPerson)
      );
    }

    dispatch(createdFeedStart(feedData));
    setDescription("");
    setImages([]);
    setTaggedPersonId([]);
    setPersonName([]);
  };

  const updatePostHandler = (feedId) => {
    if (!description) return;

    const updatedFeedData = new FormData();
    updatedFeedData.append("description", description);

    if (!images?.length) updatedFeedData.append("isImagesRemoved", true);
    else
      images.forEach((image) => {
        updatedFeedData.append("image", image);
      });

    if (!taggedPersonId.length)
      updatedFeedData.append("isTaggedListRemoved", true);
    else {
  
      taggedPersonId.forEach((taggedPerson) =>
        updatedFeedData.append("taggedUserList", taggedPerson)
      );
    }

    dispatch(updateFeedStart({ feedId, body: updatedFeedData }));
    dispatch(resetFeed());

    setDescription("");
    setImages([]);
    setTaggedPersonId([]);
    setPersonName([]);
    setIsEditPostEnable(false);
  };

  return (
    <Wrapper>
      <FlexBetween>
        <InputBase
          placeholder="what's in your mind..."
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
          value={description}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg, .jpeg, .png"
            multiple={true}
            onDrop={(acceptedFiles) => setImages([...images, acceptedFiles[0]])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {images.length === 0 ? (
                    <p>Add Images Here</p>
                  ) : (
                    <div>
                      {images.map((image, index) => (
                        <FlexBetween key={index}>
                          <Typography>{image.name ?? image.image}</Typography>
                          <Box>
                            <IconButton>
                              <AddIcon />
                            </IconButton>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();

                                handleImageDelete(index, image?.id);
                              }}
                            >
                              <DeleteOutlined />
                            </IconButton>
                          </Box>
                        </FlexBetween>
                      ))}
                    </div>
                  )}
                </Box>
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <MultipleSelectChip
        setTaggedPersonId={setTaggedPersonId}
        userNames={userList}
        personName={personName}
        setPersonName={setPersonName}
      />

      <Divider sx={{ margin: "1.25rem 0" }} />
      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem">
          <CardGiftcardOutlinedIcon sx={{ color: mediumMain }} />
          <Typography color={mediumMain}>Clip</Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem">
          <AttachFileOutlined sx={{ color: mediumMain }} />
          <Typography color={mediumMain}>Attachment</Typography>
        </FlexBetween>

        {!isEditPostEnable && (
          <FlexBetween gap="0.25rem">
            <MicOutlined sx={{ color: mediumMain }} />
            <Typography color={mediumMain}>Audio</Typography>
          </FlexBetween>
        )}

        {isEditPostEnable && (
          <Button
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
            mr={1}
            onClick={() => {
              dispatch(resetFeed());
              setIsEditPostEnable(false);
            }}
          >
            Cancel Editing
          </Button>
        )}

        <Button
          onClick={
            isEditPostEnable
              ? () => updatePostHandler(feedId)
              : createPostHandler
          }
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          {creationLoading ? (
            <CircularProgress size={20} />
          ) : isEditPostEnable ? (
            "Update Post"
          ) : (
            "Post"
          )}
        </Button>
      </FlexBetween>

      {createdFeedError && <SnackBarAlert errorMessage={createdFeedError} />}
      {userListError && <SnackBarAlert errorMessage={userListError} />}
    </Wrapper>
  );
};

export default React.memo(MyPost);
