import axios from "axios";
import { imageService } from ".";
import { apiRoute, API_HOST } from "../constants/api-routes";
import { Product } from "../models";
import { authUtils } from "../utils";

export type SortOption = "DATE" | "PRICE";

export interface SearchProductRequest {
    keyword: string;
    categoryId?: number;
    subCategoryId?: number;
    sortBy?: SortOption;
    page?: number;
}

export interface ProductResponseWithPaging {
    products: Product[];
    currentPage: number;
    totalPages: number;
}

export const productService = {
    async getTopFiveOf(top: "date" | "price" | "most-bids"): Promise<Product[]> {
        const response = (await axios.get(`${API_HOST}/products?top=${top}`)) as any;
        return response.data?.map((item: any) => Product.fromData(item));
    },
    async getProductById(id: number) {
        const response = (await axios.get(`${API_HOST}/product/${id}`)) as any;
        return {
            product: Product.fromData(response.data?.product),
            relatedProducts: response.data?.products?.content?.map((item: any) => Product.fromData(item)) as Product[],
        };
    },
    async uploadProduct(product: Product): Promise<Product | string> {
        try {
            const imageUrls = await imageService.uploadImages(product.imageFiles ?? []);

            const uploadRequest: any = {
                name: product.name,
                endAt: product.endDate,
                currentPrice: product.currentPrice,
                stepPrice: product.stepPrice,
                quickPrice: product.buyPrice,
                autoBid: product.buyPrice !== undefined,
                subCategory: {
                    id: product.subCategory?.id,
                },
                images: imageUrls.map((imageUrl, index) => {
                    return {
                        url: imageUrl,
                        isMain: index === 0,
                    };
                }),
                description: product.description,
            };

            await axios.post(`${API_HOST}/${apiRoute.SELLER}/${apiRoute.PRODUCT}`, uploadRequest, {
                headers: authUtils.getAuthHeader(),
            });

            return {
                ...product,
                images: imageUrls,
            };
        } catch (err: any) {
            return err?.response?.data?.error;
        }
    },
    async search({
        keyword,
        categoryId = 1,
        subCategoryId,
        sortBy,
        page,
    }: SearchProductRequest): Promise<ProductResponseWithPaging> {
        const requestParams: any = {
            text: keyword,
            categoryId,
            subCategoryId,
            sortBy,
            page: page ?? 0,
            size: 12,
        };

        const response: any = await axios.get(`${API_HOST}/${apiRoute.PRODUCT}`, {
            params: requestParams,
        });

        const products: Product[] = response?.data?.content.map((item: any) => {
            return Product.fromData(item);
        });
        const totalPages: number = response?.data?.totalPages;

        return { products, totalPages, currentPage: requestParams.page + 1 };
    },
};
