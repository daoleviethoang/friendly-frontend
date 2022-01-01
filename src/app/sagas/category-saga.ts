import { PayloadAction } from "@reduxjs/toolkit";
import { all, call, put, take, takeLatest } from "redux-saga/effects";
import { Category } from "../../models";
import { categoryService, ProductResponseWithPaging, productService, SearchProductRequest } from "../../services";
import {
    completeGetCategories,
    completeGetProductsByCategoryId,
    completeSearchProduct,
    requestGetCategories,
    requestProductsByCategoryId,
    requestSearchProduct,
} from "../reducers/category-slice";

function* watchGetCategories() {
    while (true) {
        try {
            yield take(requestGetCategories.type);

            const categories: Category[] = yield call(categoryService.getCategories);

            yield put(completeGetCategories(categories));
        } catch (error) {
            console.error(error);
        }
    }
}

function* watchRequestProductByCategory() {
    while (true) {
        try {
            const action: PayloadAction<{ categoryId: number; currentPage: number }> = yield take(
                requestProductsByCategoryId.type,
            );

            const { categoryId, currentPage } = action.payload as any;
            yield call(getProductByCategoryId, categoryId, currentPage);
        } catch (error) {}
    }
}

function* watchRequestSearchProduct() {
    while (true) {
        try {
            const action: PayloadAction<SearchProductRequest> = yield take(requestSearchProduct.type);

            const data: ProductResponseWithPaging = yield call(productService.search, {
                ...action.payload,
            });

            yield put(completeSearchProduct(data));
        } catch (error) {
            console.log(error);
        }
    }
}

function* getProductByCategoryId(categoryId: number, currentPage: number) {
    const { products, totalPages } = yield call(categoryService.getProductByCategoryId, categoryId, currentPage - 1);

    yield put(completeGetProductsByCategoryId({ products, totalPages }));
}

export function* categorySaga() {
    yield all([watchRequestProductByCategory(), watchRequestSearchProduct(), watchGetCategories()]);
}
