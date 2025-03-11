// assets
import { WechatOutlined } from '@ant-design/icons';

// icons
const icons = {
  WechatOutlined
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
      icon: icons.WechatOutlined
    }
  ]
};

export default Portfolio;
