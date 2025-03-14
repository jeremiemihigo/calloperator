// assets
import { BarChartOutlined, BgColorsOutlined, CheckOutlined, FileOutlined, FontSizeOutlined, RollbackOutlined } from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  FileOutlined,
  RollbackOutlined,
  BarChartOutlined,
  CheckOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Household visit',
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
      id: 'Customer details',
      title: 'Customer details',
      type: 'item',
      url: '/reponses',
      icon: icons.BgColorsOutlined
    },
    {
      id: 'Statistics (vm)',
      title: 'Statistics (vm)',
      type: 'item',
      url: '/statistiques',
      icon: icons.BarChartOutlined
    },
    {
      id: 'Approbation',
      title: 'Approbation',
      type: 'item',
      url: '/approbation',
      icon: icons.CheckOutlined
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
