import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';

function Upgrade() {
  const { item, plainteSelect, annuler, initiale, shopSelect, codeclient } = React.useContext(CreateContexteTable);
  const [autre, setAutres] = React.useState();
  const [today, setToday] = React.useState(new Date());

  const deedline = useSelector((state) => state.delai.delai);
  const returnDelai = async (statut, today) => {
    if (deedline && today) {
      const a = _.filter(deedline, { plainte: statut });
      if (a.length > 0) {
        //si la plainte existe je cherche le jour
        let critere = a[0].critere.filter((x) => x.jour === today.day_of_week);
        if (critere.length > 0) {
          //si le critere existe
          let debutHeure = critere[0].debut.split(':')[0];
          let debutMinutes = critere[0].debut.split(':')[1];
          if (
            new Date(today.datetime).getHours() > parseInt(debutHeure) ||
            (new Date(today.datetime).getHours() === parseInt(debutHeure) &&
              new Date(today.datetime).getMinutes() >= parseInt(debutMinutes))
          ) {
            return critere[0]?.delai;
          } else {
            return a[0]?.defaut;
          }
        } else {
          return a[0]?.defaut;
        }
      } else {
        return 0;
      }
    }
  };
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 10
    });
  };
  const [sending, setSending] = React.useState(false);
  const sendData = async (e) => {
    try {
      e.preventDefault();
      setSending(true);
      const delai = await returnDelai('escalade', today);
      const data = {
        codeclient,
        shop: shopSelect?.shop,
        property: 'shop',
        contact: initiale?.contact,
        nomClient: initiale?.nomClient,
        plainteSelect: plainteSelect?.title,
        typePlainte: item?.title,
        time_delai: delai,
        fullDate: today,
        materiel: autre?.materiel
      };
      const response = await axios.post(lien_issue + '/upgrade', data, config);
      if (response.status === 200) {
        annuler();
        success('Done', 'success');
        setSending(false);
      } else {
        success('' + response.data, 'error');
        setSending(false);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        success(error.message, 'error');
      }
    }
  };

  const loading = async () => {
    const reponse = await axios.get('https://worldtimeapi.org/api/timezone/Africa/Lubumbashi');
    if (reponse.status === 200) {
      setToday(reponse.data.datetime);
    }
  };
  React.useEffect(() => {
    loading();
  }, [plainteSelect]);
  return (
    <div style={{ width: '20rem' }}>
      {contextHolder}
      <div>
        <TextField
          onChange={(e) =>
            setAutres({
              ...autre,
              materiel: e.target.value
            })
          }
          name="materiel"
          autoComplete="off"
          fullWidth
          label="Matériel à upgrader"
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <Button disabled={sending} onClick={(e) => sendData(e)} color="primary" fullWidth variant="contained">
          Escalader_vers_le_Backoffice
        </Button>
      </div>
    </div>
  );
}

export default Upgrade;
