/* eslint-disable react/prop-types */
import React from 'react';
import { Typography } from '@mui/material';

function Agents({ listeDemande }) {
  const [data, setData] = React.useState({ valeur: [], keys: [] });

  const { valeur, keys } = data;
  const analyse = () => {
    try {
      const donne = _.groupBy(listeDemande, 'codeAgent');
      setData({ valeur: donne, keys: Object.keys(donne) });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    analyse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listeDemande]);
  const showNameCode = (index) => {
    try {
      return {
        nom: valeur['' + index][0].agent.nom,
        code: valeur['' + index][0].agent.codeAgent
      };
    } catch (error) {
      console.log(error);
    }
  };
  const reponduNonRepondu = (index) => {
    try {
      let repondu = 0;
      let nonRepondu = 0;
      for (let i = 0; i < valeur['' + index].length; i++) {
        if (valeur['' + index][i].reponse.length > 0) {
          repondu = repondu + 1;
        } else {
          nonRepondu = nonRepondu + 1;
        }
      }
      return { repondu, nonRepondu };
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Nom Agent</td>
            <td>Code agent</td>
            <td>Repondue(s)</td>
            <td>Attente(s)</td>
            <td>Max</td>
          </tr>
        </thead>
        <tbody>
          {keys.map((cle) => {
            return (
              <tr key={cle}>
                <td className="nom">
                  <Typography noWrap component="span" fontSize="12px">
                    {showNameCode(cle).nom}
                  </Typography>
                </td>
                <td>{showNameCode(cle).code}</td>
                <td>{reponduNonRepondu(cle).repondu}</td>
                <td>{reponduNonRepondu(cle).nonRepondu}</td>
                <td>{reponduNonRepondu(cle).repondu + reponduNonRepondu(cle).nonRepondu}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Agents;
