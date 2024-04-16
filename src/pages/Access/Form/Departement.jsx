import React from 'react';
import { Input } from 'antd';
import Button from 'Control/Bouton';
import axios from 'axios';
import { lien } from 'static/Lien';
import DirectionSnackbar from 'Control/SnackBar';

function Departement() {
  const [disabled, setDisabled] = React.useState(false);
  const [texte, setTexte] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [open, setOpen] = React.useState(true);
  const send = async () => {
    try {
      setDisabled(true);
      const response = await axios.post(lien + '/departement', { departement: texte });
      if (response.status === 200) {
        setMessage('Done :' + texte);
        setDisabled(false);
        setTexte('');
      } else {
        setDisabled(false);
        setTexte('');
      }
    } catch (error) {
      setMessage(error.response.data);
      setDisabled(false);
      setTexte('');
    }
  };
  return (
    <div style={{ width: '20rem' }}>
      {message && <DirectionSnackbar open={open} setOpen={setOpen} message={message} />}
      <div>
        <Input placeholder="Entrez le département" value={texte} onChange={(e) => setTexte(e.target.value)} />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button disabled={disabled} fonction={send} title="Envoyer" type="primary" />
      </div>
    </div>
  );
}

export default Departement;
