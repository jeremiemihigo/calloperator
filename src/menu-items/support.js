// assets
import { BarChartOutlined, BgColorsOutlined, FontSizeOutlined, RollbackOutlined, FileOutlined } from '@ant-design/icons';

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
      id: 'demande',
      title: 'Demandes',
      type: 'item',
      url: '/demandes',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'reponses',
      title: 'Visites',
      type: 'item',
      url: '/reponses',
      icon: icons.BgColorsOutlined
    },
    {
      id: 'statistiques',
      title: 'Statistiques',
      type: 'item',
      url: '/statistiques',
      icon: icons.BarChartOutlined
    },
    {
      id: 'rapport',
      title: 'Rapport',
      type: 'item',
      url: '/rapport',
      icon: icons.FileOutlined
    }
  ]
};

export default utilities;
