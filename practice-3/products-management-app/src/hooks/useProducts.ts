// Library
import { useEffect } from 'react';
import useSWR from 'swr';

// Constants
import {
  ProductTypes,
  FilterOrderOptions,
  SUCCESS_MESSAGES,
  URL_PRODUCTS
} from '@constants/index';

// Model
import { Product } from '@models/product';

// Store
import {
  useStore,
  addProductFailed,
  addProductSuccess,
  deleteProductFailed,
  deleteProductSuccess,
  editProductFailed,
  editProductSuccess,
  filterProductsSuccess,
  searchProductsSuccess,
  getProductsRequest,
  getProductsSuccess,
  getProductsFailed,
  filterProductsRequest,
  editProductRequest,
  deleteProductRequest,
  addProductRequest,
  filterProductsFailed,
  searchProductsRequest,
  searchProductsFailed
} from '@store/index';

// Helpers
import { get, post, remove, update, urlGeneration } from '@helpers/index';

/**
 * This hook help execute product data
 *
 * @returns Actions
 */
const useProducts = () => {
  const { data, error, isValidating, mutate } = useSWR<Product[]>(
    URL_PRODUCTS,
    get
  );

  const { dispatch } = useStore();

  // // Handle get all products when loaded
  useEffect(() => {
    isValidating && dispatch(getProductsRequest());

    if (!isValidating && !error && data) {
      dispatch(getProductsSuccess({ products: data }));
    } else if (!isValidating && error) {
      if (!data) {
        dispatch(
          getProductsFailed({
            errorMessage: error.message
          })
        );
      }
    }
  }, [isValidating]);

  /**
   * Add new product
   *
   * @param product Product
   * @returns void
   */
  const createProduct = async (product: Product): Promise<void> => {
    try {
      dispatch(addProductRequest());

      const newProduct: Product = await post(URL_PRODUCTS, product);

      dispatch(
        addProductSuccess({
          product: newProduct,
          successMessage: SUCCESS_MESSAGES.ADD_PRODUCT_SUCCESS
        })
      );

      await mutate([...(data || []), newProduct], false);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(addProductFailed({ errorMessage: error.message }));
      }
    }
  };

  /**
   * Edit a product
   *
   * @param product Product
   * @returns void
   */
  const editProduct = async (product: Product): Promise<void> => {
    try {
      dispatch(editProductRequest());

      const updatedProduct: Product = await update(
        `${URL_PRODUCTS}/${product.id}`,
        product
      );

      const updatedProductIndex: number =
        data?.findIndex(
          (product: Product) => product.id === updatedProduct.id
        ) || -1;

      data?.splice(updatedProductIndex, 1, updatedProduct);

      dispatch(
        editProductSuccess({
          product: updatedProduct,
          successMessage: SUCCESS_MESSAGES.EDIT_PRODUCT_SUCCESS
        })
      );

      await mutate([...(data || [])], false);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(editProductFailed({ errorMessage: error.message }));
        return;
      }
    }
  };

  /**
   * Delete product by id
   *
   * @param id string
   * @returns void
   */
  const deleteProduct = async (id: string): Promise<void> => {
    try {
      dispatch(deleteProductRequest());

      const deletedProduct: Product = await remove(`${URL_PRODUCTS}/${id}`);

      const updatedProducts: Product[] = [...(data || [])];

      const deletedProductIndex: number =
        updatedProducts?.findIndex(
          (product: Product) => product.id === deletedProduct.id
        ) || 0;

      updatedProducts?.splice(deletedProductIndex, 1);

      dispatch(
        deleteProductSuccess({
          productId: deletedProduct.id,
          successMessage: SUCCESS_MESSAGES.REMOVE_PRODUCT_SUCCESS
        })
      );

      await mutate([...(updatedProducts || [])], false);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(deleteProductFailed({ errorMessage: error.message }));
        return;
      }
    }
  };

  /**
   * Search product by name
   *
   * @param input string
   */
  const searchingProducts = async (input: string) => {
    try {
      dispatch(searchProductsRequest());

      const filteredProducts: Product[] = await get(
        urlGeneration({ searchInput: input })
      );

      dispatch(searchProductsSuccess({ filteredProducts }));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(searchProductsFailed({ errorMessage: error.message }));
        return;
      }
    }
  };

  /**
   * Filter products by type and price option
   *
   * @param currentFilterTypeParam ProductTypes
   * @param currentFilterPriceParam FilterOrderOptions
   */
  const filterProducts = async (
    currentFilterTypeParam?: ProductTypes,
    currentFilterPriceParam?: FilterOrderOptions
  ) => {
    try {
      dispatch(filterProductsRequest());

      const filteredProducts: Product[] = await get(
        urlGeneration({
          type: currentFilterTypeParam,
          priceOrder: currentFilterPriceParam
        })
      );

      dispatch(
        filterProductsSuccess({
          filteredProducts
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(filterProductsFailed({ errorMessage: error.message }));
        return;
      }
    }
  };

  return {
    deleteProduct,
    createProduct,
    editProduct,
    searchingProducts,
    filterProducts
  };
};

export default useProducts;
