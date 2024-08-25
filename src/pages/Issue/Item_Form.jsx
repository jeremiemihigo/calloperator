import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import Popup from 'static/Popup';
import { Payement_Issue, probleme_batterie, swap } from 'static/store';

function Item_Form({ item }) {
  console.log(item);
  const [value, setValue] = React.useState();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(true);
  }, [item]);
  console.log(value);
  return (
    <Popup open={open} setOpen={setOpen} title="Select">
      <div style={{ width: '20rem' }}>
        {(('8382P' === item && Payement_Issue) || ('C9RED' === item && probleme_batterie)).map((index, key) => {
          return (
            <Typography component="p" onClick={() => setValue(index)} style={{ padding: '0px', margin: '0px', width: '100%' }} key={key}>
              {index}
            </Typography>
          );
        })}
      </div>

      {item === '7U8CU' &&
        swap.map((index, key) => {
          return (
            <Typography component="p" onClick={() => setValue(index)} style={{ padding: '0px', margin: '0px', width: '100%' }} key={key}>
              {index}
            </Typography>
          );
        })}
    </Popup>
  );
}
Item_Form.propTypes = {
  item: PropTypes.string
};
export default Item_Form;
