// Libraries
import React, { useState } from 'react';

// Components
import { Image } from '@components/commons/Image';
import { Title, VariantsTypes } from '@components/commons/Title';
import { Button } from '@components/commons/Button';

// Constants
import { ButtonVariants, Currencies, FwType } from '@constants/types';
import { ERROR_MESSAGES } from '@constants/messages';

// Helpers
import { currencyFormat } from '@helpers/string';

// Styles
import './index.css';

// Type
import Product from '@models/product';

// Service
import { removeProduct } from '@services/product.service';

// Store
import { deleteProduct, error as errorAction, useStore } from '@store/index';

interface CardProps {
  product: Product;
  currency: Currencies;
}

export const Card: React.FC<CardProps> = ({
  product: { name, imageUrl, price, id, type },
  currency,
}) => {
  const { globalState, dispatch } = useStore();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDeleteProduct = async () => {
    setIsDeleteLoading(true);
    try {
      const deletedProduct: Product = await removeProduct(id);

      if (deletedProduct instanceof Error) {
        throw new Error(ERROR_MESSAGES.SERVER_RESPONSE_ERROR);
      }

      dispatch(deleteProduct(deletedProduct.id));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(errorAction(error.message));
        return;
      }
    }

    setIsDeleteLoading(false);
  };

  const handleEditProduct = () => { };

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
          variant={VariantsTypes.Subtitle}
          fs='italic'
          p='0 0.5rem'
          size='16px'
        >
          {type}
        </Title>
        <Title
          variant={VariantsTypes.Subtitle}
          fw={FwType.Bold}
          p='0.5rem'
        >
          {currencyFormat(price)}
          <span> {currency}</span>
        </Title>
        <div className='button-wrapper'>
          <Button
            title='Edit'
            handleButtonClick={handleEditProduct}
          />
          <Button
            variant={ButtonVariants.Secondary}
            title='Delete'
            isLoading={isDeleteLoading}
            handleButtonClick={handleDeleteProduct}
          />
        </div>
      </div>
    </div >
  );
};
