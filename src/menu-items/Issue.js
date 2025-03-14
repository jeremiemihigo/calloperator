// assets
import { IssuesCloseOutlined } from '@ant-design/icons';

// icons
const icons = {
  IssuesCloseOutlined
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
      icon: icons.IssuesCloseOutlined
    }
  ]
};

export default issue;
