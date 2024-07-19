// assets
import { BarChartOutlined, BgColorsOutlined, FileOutlined, FontSizeOutlined, RollbackOutlined } from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  FileOutlined,
  RollbackOutlined,
  BarChartOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Support team',
  type: 'group',
  children: [
    {
      id: 'Request',
      title: 'Request',
      type: 'item',
      url: '/demandes',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'Answer',
      title: 'Answer',
      type: 'item',
      url: '/reponses',
      icon: icons.BgColorsOutlined
    },
    {
      id: 'Statistics',
      title: 'Statistics',
      type: 'item',
      url: '/statistiques',
      icon: icons.BarChartOutlined
    },
    {
      id: 'Report',
      title: 'Report',
      type: 'item',
      url: '/rapport',
      icon: icons.FileOutlined
    }
  ]
};

export default utilities;
