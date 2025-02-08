import PropTypes from 'prop-types';
import Desangagement from './Desangagement';
import Downgrade from './Downgrade';
import InfoClient from './InfoClient';
import Rafraichissement from './Rafraishissement';
import Regularisation from './Regularisation';
import Repossession from './Reppossession';
import './style.css';
import Upgrade from './Upgrade';

function OpenForm({ type }) {
  return (
    <>
      {type && (
        <>
          {type === 'Desangagement' && <Desangagement />}
          {type === 'Regularisation' && <Regularisation />}
          {type === 'Repossession' && <Repossession />}
          {type === 'Downgrade' && <Downgrade />}
          {type === 'Upgrade' && <Upgrade />}
          {type === 'Information' && <InfoClient />}
          {type === 'Rafraichissement' && <Rafraichissement />}
        </>
      )}
    </>
  );
}
OpenForm.propTypes = {
  type: PropTypes.string
};
export default OpenForm;
