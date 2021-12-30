import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, take } from "redux-saga/effects";
import { authService } from "../../services/authenticate-service";
import { authActions, LoginRequest, LoginResponse } from "../reducers/auth-slice";

function* loginWatcher() {
    const action: PayloadAction<LoginRequest> = yield take(authActions.login.type);
    const payload = action.payload;
    yield call(login, payload);
}

function* login(data: LoginRequest) {
    try {
        const response: LoginResponse = yield call(authService.login, data);
        if (response) {
            localStorage.setItem("doran-access-token", response.accessTokens);
            localStorage.setItem("doran-refresh-token", response.refreshToken);
            yield put(authActions.setData(response));
        }
    } catch (e) {
        yield put(authActions.loginFailure("Error login"));
    }
}

export function* authSaga() {
    yield all([call(loginWatcher)]);
}