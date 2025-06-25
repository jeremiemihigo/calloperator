// assets
import {
  BgColorsOutlined,
  FontSizeOutlined,
  LineChartOutlined,
  MessageOutlined,
  UsergroupDeleteOutlined,
  UserOutlined
} from '@ant-design/icons';

// icons

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const other = {
  id: 'utilities',
  title: 'Default tracker',
  type: 'group',
  children: [
    {
      id: 'Dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/',
      icon: FontSizeOutlined
    },
    {
      id: 'All customers',
      title: 'All customers to track',
      type: 'item',
      url: '/all_customer',
      icon: UsergroupDeleteOutlined
    },
    {
      id: 'My tracker',
      title: 'My tracker',
      type: 'item',
      url: '/mesclients',
      icon: UserOutlined
    },
    {
      id: 'Historical status',
      title: 'Historical status',
      type: 'item',
      url: '/historique',
      icon: BgColorsOutlined
    },

    {
      id: 'Arbitrage',
      title: 'Arbitrage',
      type: 'item',
      url: '/arbitrage',
      icon: LineChartOutlined
    },
    {
      id: 'Status configuration',
      title: 'Status configuration',
      type: 'item',
      url: '/feedback',
      icon: MessageOutlined
    }
  ]
};

export default other;
