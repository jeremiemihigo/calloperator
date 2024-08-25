import { Checkbox, Grid, Typography } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import PropTypes from 'prop-types';
import React from 'react';
import { CreateContexteTable } from './Contexte';

function FormItem({ data, liste, setListe }) {
  const { tableother, oneormany } = data;
  const { otherItem, setOtherItem } = React.useContext(CreateContexteTable);
  const addToListe = (d) => {
    if (liste.includes(d)) {
      setListe(liste.filter((x) => x !== d));
    } else {
      setListe([...liste, d]);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        {tableother.length > 0 && !oneormany && (
          <AutoComplement value={otherItem} setValue={setOtherItem} options={tableother} title="Probleme" propr="title" />
        )}
      </div>
      {oneormany && (
        <Grid container>
          {tableother.map((index, key) => {
            return (
              <Grid key={key} item lg={6}>
                <Typography onClick={() => addToListe(index.title)} component="span" style={{ cursor: 'pointer' }}>
                  <Checkbox checked={liste.includes(index.title)} />
                  <span>{index.title}</span>
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
}
FormItem.propTypes = {
  data: PropTypes.object
};
export default FormItem;
