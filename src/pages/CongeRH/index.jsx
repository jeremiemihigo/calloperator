import React from 'react';
import { Tabs } from 'antd';
import MainCard from 'components/MainCard';
import TableContrat from './TableContrat';
import Departement from './Departement';

function Index() {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: 'Contrat',
      children: <TableContrat />
    },
    {
      key: '2',
      label: 'Departement',
      children: <Departement />
    },
    {
      key: '3',
      label: 'Type congé',
      children: 'Content of Tab Pane 3'
    },
    {
      key: '4',
      label: 'Validation',
      children: 'Content of Tab Pane 3'
    },
    {
      key: '5',
      label: 'Agents',
      children: 'Content of Tab Pane 3'
    }
  ];
  return (
    <MainCard>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </MainCard>
  );
}
export default Index;
