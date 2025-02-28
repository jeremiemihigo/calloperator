// assets
import { PhoneOutlined } from '@ant-design/icons';

// icons
const icons = {
  PhoneOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const Portfolio = {
  id: 'portefeuil',
  title: 'Portfolio team',
  type: 'group',
  children: [
    {
      id: 'Feedback',
      title: 'Feedback',
      type: 'item',
      url: '/portfolio',
      icon: icons.PhoneOutlined
    }
  ]
};

export default Portfolio;
