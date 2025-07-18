// assets
import {
  BarChartOutlined,
  BgColorsOutlined,
  HomeOutlined,
  InteractionOutlined,
  MessageOutlined,
  NodeCollapseOutlined,
  SettingOutlined,
  UsergroupDeleteOutlined,
  UserOutlined
} from '@ant-design/icons';

// icons

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: '',
  type: 'group',
  children: [
    {
      id: 'Dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/',
      icon: HomeOutlined
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
      id: 'Arbitration',
      title: 'Arbitration',
      type: 'item',
      url: '/arbitrage',
      icon: BarChartOutlined
    },
    {
      id: 'Actions',
      title: 'Actions',
      type: 'item',
      url: '/action',
      icon: InteractionOutlined
    },
    {
      id: 'Decision',
      title: 'Decision',
      type: 'item',
      url: '/decision',
      icon: NodeCollapseOutlined
    },

    {
      id: 'Status configuration',
      title: 'Status configuration',
      type: 'item',
      url: '/feedback',
      icon: MessageOutlined
    },
    {
      id: 'Settings',
      title: 'Settings',
      type: 'item',
      url: '/folder',
      icon: SettingOutlined
    }
  ]
};

export default utilities;
