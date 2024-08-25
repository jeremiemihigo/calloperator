// assets
import { PhoneOutlined } from '@ant-design/icons';

// icons
const icons = {
  PhoneOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const issue = {
  id: 'issue',
  title: 'Issue team',
  type: 'group',
  children: [
    {
      id: 'Complaints',
      title: 'Complaints',
      type: 'item',
      url: '/call',
      icon: icons.PhoneOutlined
    }
  ]
};

export default issue;
