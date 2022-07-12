// Library
import React, { FormEvent, useRef, useState } from 'react';

// Style
import './index.css';

// Constants
import {
  ButtonVariants,
  FormVariants,
  ProductTypes,
  TypeVariables
} from '@constants/index';

// Components
import Title from '@components/commons/Title';
import TextField from '@components/commons/TextField';
import Button from '@components/commons/Button';
import Select from '@components/commons/SelectItem';
import Text, { VariantsTypes } from '@components/commons/Text';

// Model
import { Product } from '@models/product';

interface FormProps {
  variants: FormVariants;
  options?: ProductTypes[];
  productItem: Product;
  validateMessage: string;
  isButtonLoading?: boolean;
  isDisableForm?: boolean;
  handleSubmit: (event: FormEvent, product: Product) => void;
}

const Form: React.FC<FormProps> = ({
  variants,
  productItem,
  options = [],
  validateMessage,
  isButtonLoading = false,
  isDisableForm = false,
  handleSubmit
}) => {
  const [product, setProduct] = useState<Product>(productItem);
  const [isDisable, setIsDisable] = useState<boolean>(isDisableForm);

  const nameRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (value: string | number, fieldName: string): void => {
    setProduct({ ...product, [fieldName as string]: value });
  };

  const handleEnableEditButton = () => {
    setIsDisable(false);

    nameRef.current && nameRef.current.focus();
  };

  return (
    <div className='form-wrapper'>
      <Title>{variants} Product</Title>
      <form
        className='form'
        onSubmit={(event: FormEvent) => handleSubmit(event, product)}
      >
        <fieldset className='field-group'>
          <TextField
            defaultValue={product.name}
            name='name'
            label='Product name'
            placeholder='Enter product name...'
            type={TypeVariables.Text}
            readonly={isDisable}
            handleInputChange={handleOnChange}
            ref={nameRef}
          />
          <Select
            label='Product type'
            options={options}
            value={product.type}
            handleSelectChange={handleOnChange}
            name='type'
            disable={isDisable}
          />
          <TextField
            defaultValue={product.price}
            name='price'
            type={TypeVariables.Number}
            label='Price'
            placeholder='Enter price...'
            readonly={isDisable}
            handleInputChange={handleOnChange}
          />
          <TextField
            defaultValue={product.imageUrl}
            name='imageUrl'
            type={TypeVariables.Text}
            label='Image link'
            placeholder='Enter image link...'
            readonly={isDisable}
            handleInputChange={handleOnChange}
          />
          {validateMessage && (
            <Text variant={VariantsTypes.Highlight} color='var(--danger)'>
              {validateMessage}
            </Text>
          )}
        </fieldset>
        {!isDisable && (
          <Button
            variant={ButtonVariants.Primary}
            title={variants}
            isLoading={isButtonLoading}
            isDisabled={isDisable}
          />
        )}
        {isDisable && (
          <Button
            title='Enable Edit'
            variant={ButtonVariants.Default}
            handleClick={handleEnableEditButton}
            isDisabled={!product.id}
          />
        )}
      </form>
    </div>
  );
};

export default Form;
