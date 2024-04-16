import React from 'react';
import { Input } from 'antd';
import Button from 'Control/Bouton';
import axios from 'axios';
import { lien } from 'static/Lien';
import DirectionSnackbar from 'Control/SnackBar';
import AutoComplement from 'Control/AutoComplet';

function Departement() {
  const [disabled, setDisabled] = React.useState(false);
  const [texte, setTexte] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [departement, setDepartement] = React.useState('');
  const [open, setOpen] = React.useState(true);
  const send = async () => {
    try {
      setDisabled(true);
      const response = await axios.post(lien + '/permission', { departement: departement?.idDepartement, title: texte });
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
  const [listeDepartement, setListeDepartement] = React.useState();
  const loadingDepartement = async () => {
    setListeDepartement();
    try {
      const response = await axios.get(lien + '/departement');
      if (response.status === 200) {
        setListeDepartement(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loadingDepartement();
  }, []);

  return (
    <div style={{ width: '20rem' }}>
      {!listeDepartement ? (
        <p style={{ textAlign: 'center', color: 'blue', fontSize: '12px' }}>Loading...</p>
      ) : (
        <>
          {message && <DirectionSnackbar open={open} setOpen={setOpen} message={message} />}
          <div style={{ margin: '10px 0px' }}>
            <AutoComplement
              value={departement}
              setValue={setDepartement}
              options={listeDepartement}
              title="Département"
              propr="departement"
            />
          </div>
          <div>
            <Input placeholder="Rôle" value={texte} onChange={(e) => setTexte(e.target.value)} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <Button disabled={disabled} fonction={send} title="Envoyer" type="primary" />
          </div>
        </>
      )}
    </div>
  );
}

export default Departement;
