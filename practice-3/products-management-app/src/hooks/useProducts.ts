// Library
import { useEffect } from 'react';
import useSWR from 'swr';

// Constants
import {
  ProductTypes,
  FilterOrderOptions,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  URL_PRODUCTS,
  localKey
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
  addProductRequest
} from '@store/index';

// Helpers
import {
  get,
  post,
  remove,
  update,
  urlFilterGenerate,
  urlSearchingGenerate,
  setLocalProducts
} from '@helpers/index';

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

  // Handle get all products when loaded
  useEffect(() => {
    isValidating && dispatch(getProductsRequest());

    if (!isValidating && !error && data) {
      dispatch(getProductsSuccess({ products: data }));

      // save local
      setLocalProducts(localKey, data);
    } else if (!isValidating && error) {
      if (error instanceof Error) {
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

      if (!newProduct) {
        throw new Error(ERROR_MESSAGES.SERVER_RESPONSE_ERROR);
      }

      await mutate([...(data || []), newProduct], false);

      dispatch(
        addProductSuccess({
          product: newProduct,
          successMessage: SUCCESS_MESSAGES.ADD_PRODUCT_SUCCESS
        })
      );

      // save data local
      data && setLocalProducts(localKey, [...data, newProduct]);
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

      if (!updatedProduct) {
        throw new Error(ERROR_MESSAGES.EDIT_PRODUCT_FAILED);
      }

      data?.splice(updatedProductIndex, 1, updatedProduct);

      await mutate([...(data || [])], false);

      dispatch(
        editProductSuccess({
          product: updatedProduct,
          successMessage: SUCCESS_MESSAGES.EDIT_PRODUCT_SUCCESS
        })
      );

      // save local data
      data && setLocalProducts(localKey, data);
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

      if (!deletedProduct || !deletedProductIndex) {
        throw new Error(ERROR_MESSAGES.REMOVE_PRODUCT_FAILED);
      }

      updatedProducts?.splice(deletedProductIndex, 1);

      await mutate([...(updatedProducts || [])], false);

      dispatch(
        deleteProductSuccess({
          productId: deletedProduct.id,
          successMessage: SUCCESS_MESSAGES.REMOVE_PRODUCT_SUCCESS
        })
      );

      // save local data
      setLocalProducts(localKey, updatedProducts);
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
    const filteredProducts: Product[] = await get(urlSearchingGenerate(input));

    dispatch(searchProductsSuccess({ filteredProducts, input }));
  };

  /**
   * Filter products by type and price option
   *
   * @param currentFilterTypeParam ProductTypes
   * @param currentFilterPriceParam FilterOrderOptions
   */
  const filterProducts = async (
    currentFilterTypeParam: ProductTypes,
    currentFilterPriceParam: FilterOrderOptions
  ) => {
    dispatch(filterProductsRequest());

    const filteredProducts: Product[] = await get(
      urlFilterGenerate(currentFilterTypeParam, currentFilterPriceParam)
    );

    dispatch(
      filterProductsSuccess({
        currentFilterTypeParam,
        currentFilterPriceParam,
        filteredProducts
      })
    );
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
