// assets
import { BgColorsOutlined, FontSizeOutlined, LineChartOutlined, UserOutlined } from '@ant-design/icons';

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
      id: 'My customers',
      title: 'My customers',
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
      id: 'Performance of agents',
      title: 'Performance of agents',
      type: 'item',
      url: '/performance',
      icon: LineChartOutlined
    },
    {
      id: 'Arbitrage',
      title: 'Arbitrage',
      type: 'item',
      url: '/arbitrage',
      icon: LineChartOutlined
    }
  ]
};

export default other;
