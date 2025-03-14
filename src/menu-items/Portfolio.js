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
      id: 'Record call',
      title: 'Record call',
      type: 'item',
      url: '/portfolio',
      icon: icons.PhoneOutlined
    }
  ]
};

export default Portfolio;
