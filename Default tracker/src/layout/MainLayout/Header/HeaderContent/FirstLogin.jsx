// material-ui
import { Button, Flex } from 'antd';
import * as React from 'react';
// third party

import { Edit } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, Slide, Typography } from '@mui/material';
import { Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { lien_post } from 'static/Lien';
// project import

// assets
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
// ============================|| FIREBASE - LOGIN ||============================ //

const NouvelleInscription = () => {
  const [open, setOpen] = React.useState(true);
  const userConnect = useSelector((state) => state.user?.user);
  const [password, setPassword] = React.useState({ first: '', second: '' });
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);

  const sendData = async (e) => {
    e.preventDefault();
    try {
      if (password.first !== password.second) {
        setMessage('The password is not correct');
      } else {
        if (password.first === '1234') {
          setMessage('Default password to change');
        } else {
          setSending(true);
          const response = await axios.put(lien_post + '/userAdmin', {
            codeAgent: userConnect && userConnect.codeAgent,
            ancien: '1234',
            nouvelle: password.first
          });
          setSending(false);
          if (response.status === 200) {
            setOpen(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted aria-describedby="alert-dialog-slide-description">
      <DialogTitle>
        <Typography component="p" sx={{ fontSize: '12px' }}>
          Please Change the default password
        </Typography>
      </DialogTitle>
      <DialogContent>
        {message !== '' && <p style={{ fontSize: '12px', marginBottom: '10px', color: 'red' }}>{message}</p>}
        <div style={{ marginBottom: '10px' }}>
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setPassword({
                ...password,
                first: e.target.value
              })
            }
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Input
            type="password"
            placeholder="Repeat password"
            onChange={(e) =>
              setPassword({
                ...password,
                second: e.target.value
              })
            }
          />
        </div>
        <Flex vertical gap="small" style={{ width: '100%' }}>
          <Button disabled={sending} onClick={(e) => sendData(e)} type="primary" block>
            <Edit fontSize="small" sx={{ marginRight: '5px' }} /> Edit
          </Button>
        </Flex>
      </DialogContent>
    </Dialog>
  );
};

export default NouvelleInscription;
