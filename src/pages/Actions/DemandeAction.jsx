/* eslint-disable react/prop-types */
import React from 'react';
import { Grid } from '@mui/material';

function DemandeAction({ client }) {
  console.log(client);
  return (
    <div>
      toutes les actions ainsi que la possibilité des les exportées en Excel
      <Grid container className="options">
        <Grid item lg={3}>
          Valide
        </Grid>
        <Grid item lg={3}>
          Attente
        </Grid>
      </Grid>
      <table>
        <tbody>
          {client.map((index) => {
            return (
              <React.Fragment key={index._id}>
                <tr>
                  <td>{index.codeclient}</td>
                </tr>
                {index.action[0]?.text && (
                  <tr>
                    <td>{index.action[0]?.text}</td>
                  </tr>
                )}
                {index.action[0]?.action && (
                  <tr>
                    <td>{index.action[0]?.action}</td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DemandeAction;
