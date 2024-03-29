// Constants
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@constants/messages';
import { ProductTypes, FilterOrderOptions } from '../constants/types';

// Model
import { Product } from '@models/product';

// Service
import {
  addNewProduct,
  filterProductsByTypeAndPrice,
  getAllProduct,
  removeProduct,
  searchProducts,
  updateProduct
} from '@services/product.service';

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
  filterProductsRequest
} from '@store/index';

/**
 * This hook help execute product data
 *
 * @returns Actions
 */
const useProducts = () => {
  const { dispatch } = useStore();

  /**
   * Get all products and save to local
   */
  const getProducts = async () => {
    try {
      dispatch(getProductsRequest());

      const products: Product[] = await getAllProduct();

      if (!products.length) {
        throw new Error(ERROR_MESSAGES.SERVER_RESPONSE_ERROR);
      }

      dispatch(getProductsSuccess({ products }));
    } catch (err) {
      if (err instanceof Error) {
        dispatch(getProductsFailed({ errorMessage: err.message }));
      }
    }
  };

  /**
   * Add new product
   *
   * @param product Product
   * @returns void
   */
  const createProduct = async (product: Product): Promise<void> => {
    try {
      const newProduct: Product = await addNewProduct(product);

      if (!newProduct) {
        throw new Error(ERROR_MESSAGES.ADD_PRODUCT_FAILED);
      }

      dispatch(
        addProductSuccess({
          product: newProduct,
          successMessage: SUCCESS_MESSAGES.ADD_PRODUCT_SUCCESS
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(addProductFailed({ errorMessage: error.message }));
        return;
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
      const updatedProduct: Product = await updateProduct(product);
      if (!updatedProduct) {
        throw new Error(ERROR_MESSAGES.EDIT_PRODUCT_FAILED);
      }

      dispatch(
        editProductSuccess({
          product: updatedProduct,
          successMessage: SUCCESS_MESSAGES.EDIT_PRODUCT_SUCCESS
        })
      );
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
      const deletedProduct: Product = await removeProduct(id);

      if (!deletedProduct) {
        throw new Error(ERROR_MESSAGES.SERVER_RESPONSE_ERROR);
      }

      dispatch(
        deleteProductSuccess({
          productId: deletedProduct.id,
          successMessage: SUCCESS_MESSAGES.REMOVE_PRODUCT_SUCCESS
        })
      );
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
    const filterProducts: Product[] = await searchProducts(input);
    dispatch(searchProductsSuccess({ filterProducts, input }));
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
    const filteredProducts: Product[] = await filterProductsByTypeAndPrice(
      currentFilterTypeParam,
      currentFilterPriceParam
    );

    dispatch(filterProductsRequest());

    dispatch(
      filterProductsSuccess({
        currentFilterTypeParam,
        currentFilterPriceParam,
        filteredProducts
      })
    );
  };

  return {
    getProducts,
    deleteProduct,
    createProduct,
    editProduct,
    searchingProducts,
    filterProducts
  };
};

export default useProducts;
