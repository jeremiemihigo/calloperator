/* eslint-disable react/prop-types */
import React from 'react';
import { Typography, Fab, Tooltip } from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import _ from 'lodash';
import Popup from 'static/Popup';
import AfficheInfo from './AfficheInfo';

function Agents({ listeDemande }) {
  const [data, setData] = React.useState({ valeur: [] });
  const [donnee, setDonnees] = React.useState();

  const { valeur } = data;

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
      return { repondu, nonRepondu, total: repondu + nonRepondu };
    } catch (error) {
      console.log(error);
    }
  };
  const [show, setShow] = React.useState(false);
  const [dataToShow, setDataToShow] = React.useState();
  const sendDetails = (e, code) => {
    e.preventDefault();
    setDataToShow(_.filter(listeDemande, { codeAgent: code }));
    setShow(true);
  };
  const analyse = () => {
    try {
      const donne = _.groupBy(listeDemande, 'codeAgent');
      setData({ valeur: donne });
      let table = [];
      let donnerKey = Object.keys(donne);
      for (let i = 0; i < donnerKey.length; i++) {
        table.push({
          nom: showNameCode(donnerKey[i]).nom,
          code: showNameCode(donnerKey[i]).code,
          nonRepondu: reponduNonRepondu(donnerKey[i]).nonRepondu,
          repondu: reponduNonRepondu(donnerKey[i]).repondu,
          total: reponduNonRepondu(donnerKey[i]).total
        });
      }

      setDonnees(_.orderBy(table, 'total', 'desc'));
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    analyse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listeDemande]);
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
            <td>Détails</td>
          </tr>
        </thead>
        <tbody>
          {donnee &&
            donnee.map((cle) => {
              return (
                <tr key={cle.code}>
                  <td className="nom">
                    <Typography noWrap component="span" fontSize="12px">
                      {cle.nom}
                    </Typography>
                  </td>
                  <td>{cle.code}</td>
                  <td>{cle.repondu}</td>
                  <td>{cle.nonRepondu}</td>
                  <td>{cle.total}</td>
                  <td>
                    <Tooltip title="Plus les détails" onClick={(e) => sendDetails(e, cle)}>
                      <Fab size="small" color="primary">
                        <MedicalInformationIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {dataToShow && (
        <Popup open={show} setOpen={setShow} title={`pour ${dataToShow[0].agent.nom} -------- code : ${dataToShow[0].agent.codeAgent}`}>
          <AfficheInfo data={dataToShow} />
        </Popup>
      )}
    </div>
  );
}

export default Agents;
