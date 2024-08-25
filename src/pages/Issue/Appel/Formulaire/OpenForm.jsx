import PropTypes from 'prop-types';
import React from 'react';
import Popup from 'static/Popup';
import Desangagement from './Desangagement';
import Downgrade from './Downgrade';
import InfoClient from './InfoClient';
import Rafraichissement from './Rafraishissement';
import Regularisation from './Regularisation';
import Repossession from './Reppossession';
import './style.css';
import Upgrade from './Upgrade';

function OpenForm({ type }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(true);
  }, [type]);
  return (
    <>
      {type && (
        <Popup open={open} setOpen={setOpen} title={type}>
          {type === 'Desangagement' && <Desangagement />}
          {type === 'Regularisation' && <Regularisation />}
          {type === 'Repossession' && <Repossession />}
          {type === 'Downgrade' && <Downgrade />}
          {type === 'Upgrade' && <Upgrade />}
          {type === 'Information' && <InfoClient />}
          {type === 'Rafraichissement' && <Rafraichissement />}
        </Popup>
      )}
    </>
  );
}
OpenForm.propTypes = {
  type: PropTypes.string
};
export default OpenForm;
