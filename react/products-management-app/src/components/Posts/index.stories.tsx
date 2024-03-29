// Library
import { ComponentStory, ComponentMeta } from '@storybook/react';

// Components
import Posts from './index';

// Styles
import '@assets/styles/reset.css';
import '@assets/styles/App.css';
import '@assets/styles/variables.css';
import './index.css';

// Helper
import { get } from '@helpers/clientRequests';

// Constant
import { URL_PRODUCTS } from '@constants/api';

// Model
import { Product } from '@models/product';

const products: Product[] = await get(URL_PRODUCTS);

export default {
  title: 'Components/Posts',
  component: Posts
} as ComponentMeta<typeof Posts>;

const Template: ComponentStory<typeof Posts> = (args) => <Posts {...args} />;

export const Default = Template.bind({});
Default.args = {
  handleOpenModalForm: () => {}
};

export const Loading = Template.bind({});
Loading.args = {
  handleOpenModalForm: () => {}
};
