import { all } from "redux-saga/effects";
import { watchUserAuthSaga } from "./userAuthSaga";
import { watchUserDetails } from "./userDetailsSaga";
import { watchFeed } from "./feedSaga";
import watchComment from "./commentSaga";
import watchUserLikeList from "./userFeedLikeSaga";
import { watchImageSaga } from "./imageSaga";

export default function* rootSaga() {
  yield all([
    watchUserAuthSaga(),
    watchUserDetails(),
    watchFeed(),
    watchComment(),
    watchUserLikeList(),
    watchImageSaga(),
  ]);
}
