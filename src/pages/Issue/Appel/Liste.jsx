import { CreateContexteGlobal } from 'GlobalContext';
import axios from 'axios';
import MainCard from 'components/MainCard';
import React from 'react';
import { config, lien_issue } from 'static/Lien';
import StatistiqueCallOperator from './Table/Stat_CO';

function Liste() {
  const { socket } = React.useContext(CreateContexteGlobal);
  const [nowCall, setNowCall] = React.useState();
  const [today, setToday] = React.useState([]);
  React.useEffect(() => {
    if (socket) {
      socket.on('appel', (donner) => {
        setNowCall(donner);
      });
    }
  }, [socket]);
  const laoding = async () => {
    const response = await axios.get(lien_issue + '/today', config);
    if (response.status === 200) {
      setToday(response.data);
    }
  };
  React.useEffect(() => {
    laoding();
  }, []);
  React.useEffect(() => {
    if (nowCall) {
      setToday([nowCall, ...today]);
    }
  }, [nowCall]);
  return (
    <div className="liste">
      <p className="pCall">{today.length} complaint received</p>
      <MainCard sx={{ mt: 2 }} content={false}>
        <StatistiqueCallOperator data={today} />
      </MainCard>
    </div>
  );
}

export default React.memo(Liste);
