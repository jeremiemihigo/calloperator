import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import PropType from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue, returnDelai, returnTime } from 'static/Lien';
import Selected from 'static/Select';

function ValiderAction({ clients }) {
  const stat = [
    { id: 1, title: 'Resolved', value: 'resolved' },
    { id: 2, title: 'Not Resolved', value: 'not_resolved' }
  ];
  const [value, setValue] = React.useState();
  const [commentaire, setCommentaire] = React.useState();
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 5
    });
  };

  const [sending, setSending] = React.useState(false);
  const deedline = useSelector((state) => state.delai.delai);
  const [today, setToday] = React.useState({
    datetime: new Date(),
    day_of_week: new Date().getDay()
  });

  const loading = async () => {
    try {
      const now = await axios.get('https://worldtimeapi.org/api/timezone/Africa/Lubumbashi');
      setToday(now.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);

  const Valider = async (e) => {
    e.preventDefault();
    try {
      setSending(true);

      const d = 'resolved_awaiting_confirmation';
      const delai = await returnDelai(d, deedline, today);
      const sla = clients.time_delai - returnTime(clients.fullDateSave, today?.datetime) > 0 ? 'IN SLA' : 'OUT SLA';
      const dataNotResolved = {
        num_ticket: clients?.idPlainte,
        statut: value,
        time_delai: delai,
        fullDate: today.datetime,
        delai: sla,
        commentaire
      };
      const dataResolved = {
        num_ticket: clients?.idPlainte,
        statut: value,
        time_delai: delai,
        fullDate: today.datetime,
        delai: sla,
        commentaire,
        open: value === 'resolved' ? false : true
      };
      const datas = value === 'resolved' ? dataResolved : dataNotResolved;

      const response = await axios.post(lien_issue + '/verification_ticket', datas, config);
      if (response.status === 200) {
        success('Done', 'success');
        setSending(false);
      } else {
        setSending(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ width: '20rem' }}>
      {contextHolder}
      <div style={{ marginTop: '5px' }}>
        <Selected label="Statut" data={stat} value={value} setValue={setValue} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => setCommentaire(e.target.value)}
          value={commentaire}
          style={{ marginTop: '10px' }}
          name="commentaire"
          autoComplete="off"
          fullWidth
          label="commentaire"
        />
      </div>
      <div>
        <Button disabled={sending} onClick={(e) => Valider(e)} variant="contained" color="primary" fullWidth>
          Next
        </Button>
      </div>
    </div>
  );
}
ValiderAction.propTypes = {
  clients: PropType.object
};
export default React.memo(ValiderAction);
