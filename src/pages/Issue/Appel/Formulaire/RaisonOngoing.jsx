import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { CreateContexteTable } from '../Contexte';

function RaisonOngoing({ func, sending }) {
  const { setRaisonOngoing, raisonOngoing } = React.useContext(CreateContexteTable);

  const [messageApi, contextHolder] = message.useMessage();

  const alert = (content, type) => {
    messageApi.open({
      content,
      duration: 5,
      type
    });
  };
  const send = (e) => {
    e.preventDefault();
    if (raisonOngoing) {
      func('ongoing', e);
    } else {
      alert('Pourquoi ongoing ?', 'error');
    }
  };

  return (
    <div style={{ width: '20rem' }}>
      {contextHolder}
      <div style={{ marginTop: '10px' }}>
        <TextField
          value={raisonOngoing}
          onChange={(e) => setRaisonOngoing(e.target.value)}
          name="ongoing"
          autoComplete="off"
          fullWidth
          label="Why Ongoing ?"
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button disabled={sending} onClick={(e) => send(e)} fullWidth variant="contained" color="primary">
          Ongoing
        </Button>
      </div>
    </div>
  );
}
RaisonOngoing.propTypes = {
  func: PropTypes.func,
  sending: PropTypes.bool
};
export default RaisonOngoing;
