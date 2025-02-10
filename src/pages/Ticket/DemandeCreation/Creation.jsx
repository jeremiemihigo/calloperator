import React from 'react';
import { Input } from 'antd';
import BoutonComponent from 'Control/Bouton';

function Creation() {
  const [disabled, setDisabled] = React.useState(false);
  const sending = () => {
    setDisabled(true);
  };
  //codeclient, contact, commentaire
  return (
    <div style={{ width: '20rem' }}>
      <div>
        <Input placeholder="Code client" />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <Input placeholder="Numéro joignable du client" />
      </div>
      <div>
        <Input placeholder="Commentaire" />
      </div>
      <div style={{ marginTop: '10px' }}>
        <BoutonComponent disabled={disabled} fonction={sending} title="Envoyer" type="primary" />
      </div>
    </div>
  );
}

export default Creation;
