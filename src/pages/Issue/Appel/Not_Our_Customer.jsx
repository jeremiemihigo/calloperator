import { Save } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue } from 'static/Lien';

function Not_Our_Customer({ property }) {
  const [initial, setInitial] = React.useState({ nomClient: '', contact: '', raison: '' });
  const { nomClient, contact, raison } = initial;
  const [sending, setSending] = React.useState(false);

  const user = useSelector((state) => state.user?.user);
  const onchange = (e) => {
    const { value, name } = e.target;
    setInitial({
      ...initial,
      [name]: value
    });
  };

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 5
    });
  };

  const sendData = async () => {
    try {
      setSending(true);
      const data = {
        nomClient: initial.nomClient,
        contact: initial.contact,
        about: initial?.raison,
        origin: property,
        shop: user?.plainteShop && user.plainteShop
      };
      const response = await axios.post(lien_issue + '/information_customer', data, config);
      if (response.status === 200) {
        success('Done', 'success');
        setInitial({ nomClient: '', contact: '', raison: '' });
        setSending(false);
      } else {
        success(response.data, 'error');
        setSending(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {contextHolder}
      <div>
        <TextField
          onChange={(e) => onchange(e)}
          style={{ marginTop: '10px' }}
          name="nomClient"
          autoComplete="off"
          fullWidth
          value={nomClient}
          label="customer Name"
        />
      </div>
      <div>
        <TextField
          onChange={(e) => onchange(e)}
          style={{ marginTop: '10px' }}
          name="contact"
          value={contact}
          autoComplete="off"
          fullWidth
          label="Contact"
        />
      </div>
      <div>
        <TextField
          onChange={(e) => onchange(e)}
          style={{ marginTop: '10px' }}
          name="raison"
          autoComplete="off"
          value={raison}
          fullWidth
          label="Information about"
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button disabled={sending} variant="contained" fullWidth color="primary" onClick={(e) => sendData(e)}>
          <Save fontSize="small" /> <span style={{ marginLeft: '10px' }}>Valider</span>
        </Button>
      </div>
    </div>
  );
}

export default React.memo(Not_Our_Customer);
