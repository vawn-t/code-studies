// Libraries
import React, { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Hooks
import useProductById from '@hooks/useProductById';

// Layouts
import Header from '@layouts/Header';
import ProductDetail from '@layouts/ProductDetail';

// Store
import { useStore } from '@store/index';

// Style
import './index.css';

// Components
import { Text } from '@components/index';

// Constants
import { ERROR_MESSAGES, VariantsTypes } from '@constants/index';

const DetailPage: React.FC = () => {
  const { globalState } = useStore();

  const { id } = useParams() as { id: string };

  const { getProduct, isValidating } = useProductById(id);

  const { currentProduct } = globalState;

  useEffect(() => {
    if (!isValidating) {
      getProduct();
    }
  }, [isValidating]);

  return (
    <>
      <Header />

      {currentProduct ? (
        <ProductDetail product={currentProduct} />
      ) : (
        <div className='error-message'>
          <Text color='var(--danger)' variant={VariantsTypes.Highlight}>
            {ERROR_MESSAGES.PRODUCT_NOT_FOUND}
          </Text>
        </div>
      )}
    </>
  );
};

export default memo(DetailPage);
