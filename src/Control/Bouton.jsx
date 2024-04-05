/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from 'antd';
function BoutonComponent({ disabled, fonction, title, type }) {
  const [loadings, setLoadings] = React.useState([]);
  const enterLoading = async (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    fonction();
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  };
  return (
    <Button type={type} disabled={disabled} loading={loadings[0]} onClick={() => enterLoading(0)}>
      {title}
    </Button>
  );
}

export default BoutonComponent;
