import { Typography } from '@mui/material';
import { CreateContexteGlobal } from 'GlobalContext';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { config, lien_issue } from 'static/Lien';

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
      <p className="pCall">{today.length} calls received</p>
      {today &&
        today.length > 0 &&
        today.map((index) => {
          return (
            <div key={index._id} className="appel">
              <Typography className="client">
                {index.codeclient} {'; ' + index?.nomClient !== undefined && index?.nomClient}
              </Typography>
              <div className="appelLast">
                <p>{index.openBy}</p>
                <p className={index.delai === 'OUT SLA' ? 'out' : 'in'}>{index.delai}</p>
                <p className="heure">{moment(index.fullDateSave).fromNow()}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Liste;
