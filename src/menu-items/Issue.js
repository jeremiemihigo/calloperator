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
      id: 'Call',
      title: 'Receive the call',
      type: 'item',
      url: '/call',
      icon: icons.PhoneOutlined
    }
  ]
};

export default issue;
