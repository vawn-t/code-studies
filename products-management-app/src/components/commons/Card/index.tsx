// Libraries
import React, { memo, useEffect, useState } from 'react';

// Components
import Image from '@components/commons/Image';
import Title, { VariantTypes } from '@components/commons/Title';
import Button from '@components/commons/Button';

// Constants
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@constants/messages';
import { ButtonVariants, Currencies, FwType } from '@constants/types';

// Helpers
import { currencyFormat } from '@helpers/string';

// Styles
import './index.css';

// Type
import { Product } from '@type/product';

// Service
import { removeProduct } from '@services/product.service';

// Store
import { deleteProductFailed, deleteProductSuccess, useStore } from '@store/index';

interface CardProps {
  product: Product;
  currency: Currencies;
  onOpenModalForm: (product: Product) => void;
}

const Card: React.FC<CardProps> = ({
  product,
  currency,
  onOpenModalForm
}) => {
  const { dispatch } = useStore();

  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  const { name, imageUrl, price, id, type } = product || {};

  const handleToggleModal = () => {
    onOpenModalForm(product);
  };

  const handleDeleteProduct = async () => {
    setIsDeleteLoading(true);
    try {
      const deletedProduct: Product = await removeProduct(id);

      if (!deletedProduct) {
        throw new Error(ERROR_MESSAGES.SERVER_RESPONSE_ERROR);
      }

      dispatch(deleteProductSuccess({
        productId: deletedProduct.id, message: SUCCESS_MESSAGES.REMOVE_PRODUCT_SUCCESS
      }));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(deleteProductFailed(error.message));
        return;
      }
    }

    setIsDeleteLoading(false);
  };

  return (
    <div className='card'>
      <Image
        imageUrl={imageUrl}
        alt={name}
        className='card-image'
      />
      <div className='card-body'>
        <div className='title-wrapper'>
          <Title className='card-title' p='0.5rem 0.5rem 0 0.5rem'>{name}</Title>
        </div>
        <Title
          color='var(--dark)'
          variant={VariantTypes.Subtitle}
          fs='italic'
          p='0 0.5rem'
          size='16px'
        >
          {type}
        </Title>
        <Title
          variant={VariantTypes.Subtitle}
          fw={FwType.Bold}
          p='0.5rem'
        >
          {currencyFormat(price)}
          <span> {currency}</span>
        </Title>
        <div className='button-wrapper'>
          <Button
            title='Edit'
            onClick={handleToggleModal}
          />
          <Button
            variant={ButtonVariants.Secondary}
            title='Delete'
            isLoading={isDeleteLoading}
            onClick={handleDeleteProduct}
          />
        </div>
      </div>
    </div >
  );
};

export default Card;
