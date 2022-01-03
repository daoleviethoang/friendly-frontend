import axios from "axios";
import { ProductResponseWithPaging } from ".";
import { ChangePasswordRequest, ChangePasswordResponse, CHANGE_STATUS } from "../app/reducers/change-password-slice";
import { apiRoute, API_HOST, pagingConstant } from "../constants";
import { Product, User } from "../models";
import { authUtils } from "../utils";

export interface UserResponseWithPaging {
    users?: User[];
    currentPage?: number;
    totalPages?: number;
}

export const userService = {
    async getUser(): Promise<User> {
        const response = await axios.get(`${API_HOST}/${apiRoute.USER}`, {
            headers: authUtils.getAuthHeader(),
        });

        return User.fromData(response.data);
    },
    async updateUser(user: User): Promise<boolean> {
        try {
            const requestData = {
                name: user.name,
                dateOfBirth: user.dob,
                email: user.email,
            };

            const response = await axios.patch(`${API_HOST}/${apiRoute.USER}`, requestData, {
                headers: authUtils.getAuthHeader(),
            });

            const newAccessToken = response.data.responseHeader?.accessToken;

            if (newAccessToken !== undefined && newAccessToken !== null) {
                authUtils.updateAccessToken(newAccessToken);
            }

            return true;
        } catch (error) {
            return false;
        }
    },
    async getUserSellingProducts(): Promise<Product[] | undefined> {
        try {
            const response = await axios.get(`${API_HOST}/${apiRoute.SELLER}/${apiRoute.PRODUCTS}`, {
                headers: authUtils.getAuthHeader(),
                params: {
                    page: 0,
                    size: 99,
                },
            });

            const products: Product[] = response.data?.responseBody?.content?.map((product: any) =>
                Product.fromData(product),
            );

            return products;
        } catch (error: any) {
            console.log(error?.response?.data);
            return undefined;
        }
    },
    async addToWatchList(product: Product): Promise<boolean> {
        try {
            const response = await axios.post(
                `${API_HOST}/${apiRoute.USER}/${apiRoute.WATCH_LIST}/${apiRoute.PRODUCT}/${product.id}`,
                {},
                {
                    headers: authUtils.getAuthHeader(),
                },
            );

            const accessToken = response.data?.responseHeader?.accessToken;
            if (accessToken) {
                authUtils.updateAccessToken(accessToken);
            }

            return true;
        } catch (error: any) {
            console.error(error?.response?.data);
            return false;
        }
    },
    async getFavoriteProducts(page: number = 0): Promise<ProductResponseWithPaging | undefined> {
        try {
            const response = await axios.get(`${API_HOST}/${apiRoute.USER}/${apiRoute.WATCH_LIST}`, {
                headers: authUtils.getAuthHeader(),
                params: {
                    page,
                    size: pagingConstant.PAGE_SIZE,
                },
            });

            const products: Product[] = response.data?.responseBody?.content?.map((item: any) =>
                Product.fromData(item.product),
            );

            return {
                products: products,
                currentPage: page + 1,
                totalPages: response.data?.responseBody?.totalPages ?? 1,
            };
        } catch (error: any) {
            console.error(error?.response?.data);
            return undefined;
        }
    },

    async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
        try {
            const response = (await axios.post(`${API_HOST}/auth/change-password`, request)) as any;
            return response.data;
        } catch (error: any) {
            console.error(error?.response?.data);
            return {
                status: CHANGE_STATUS.FAILED,
                timeStamp: "",
                message: "Error changing password",
            };
        }
    },
    async upgrade(userId: string): Promise<string | undefined> {
        try {
            const response = await axios.patch(`${API_HOST}/${apiRoute.ADMIN}/${apiRoute.BIDDER}/${userId}`, {
                Headers: authUtils.getAuthHeader(),
            });
            if (response.data?.responseHeader?.accessToken) {
                authUtils.updateAccessToken(response.data?.responseHeader?.accessToken);
            }
            return response.data?.message;
        } catch (error: any) {
            console.error(error?.response?.data);
            return undefined;
        }
    },

    async downgrade(userId: string): Promise<string | undefined> {
        try {
            console.log(userId);
            const response = await axios.patch(`${API_HOST}/${apiRoute.ADMIN}/${apiRoute.SELLER}/${userId}`, {
                Headers: authUtils.getAuthHeader(),
            });
            // console.log(response);
            if (response.data?.responseHeader?.accessToken) {
                authUtils.updateAccessToken(response.data?.responseHeader?.accessToken);
            }
            return response.data?.message;
        } catch (error: any) {
            console.error(error?.response?.data);
            return undefined;
        }
    },

    async getListSellers(page: number = 0): Promise<UserResponseWithPaging | undefined> {
        try {
            const response = await axios.get(`${API_HOST}/${apiRoute.ADMIN}/${apiRoute.SELLER}`, {
                headers: authUtils.getAuthHeader(),
                params: {
                    page,
                    size: pagingConstant.PAGE_SIZE,
                },
            });
            const users: User[] = response.data?.responseBody?.content?.map((seller: any) => User.fromData(seller));
            return {
                users: users,
                currentPage: page + 1,
                totalPages: response.data?.responseBody?.totalPages ?? 1,
            };
        } catch (error: any) {
            console.error(error?.response?.data);
        }
    },

    async getListRequestUpgrade(page: number): Promise<UserResponseWithPaging | undefined> {
        try {
            const response = await axios.get(`${API_HOST}/${apiRoute.ADMIN}/${apiRoute.BIDDER}`, {
                headers: authUtils.getAuthHeader(),
                params: {
                    page,
                    size: pagingConstant.PAGE_SIZE,
                },
            });
            console.log(response.data?.responseBody);
            const users: User[] = response.data?.responseBody?.content?.map((seller: any) => User.fromData(seller));
            return {
                users: users,
                currentPage: page + 1,
                totalPages: response.data?.responseBody?.totalPages ?? 1,
            };
        } catch (error: any) {
            console.error(error?.response?.data);
        }
    },
};
