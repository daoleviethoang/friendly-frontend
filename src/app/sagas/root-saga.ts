import { all, fork } from "redux-saga/effects";

export default function* rootSaga() {
    console.log(`Start root saga`);
    yield all([]);
}