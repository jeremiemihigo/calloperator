import { CreateContexte } from 'Context';
import React from 'react';
import moment from 'moment';
import { Grid } from '@mui/material';
import './chat.css';

function Chats() {
  const { chat, setDemande } = React.useContext(CreateContexte);

  return (
    <div>
      {chat &&
        chat.length > 0 &&
        chat.map((index) => {
          return (
            <Grid onClick={() => setDemande(index.demandeId[0])} key={index._id} className="message">
              <div className="messageTitle">
                {index.demandeId.length > 0 && <p>Demande, {index.demandeId[0].codeAgent}</p>}
                {index.reponseId.length > 0 && <p>Reponse, {index.reponseId[0].codeclient}</p>}
              </div>
              <div className="messageBody">
                <p className="messageBody_Message">{index.message}</p>
                <p className="messageBody_date">{moment(index.createdAt).fromNow()}</p>
              </div>
            </Grid>
          );
        })}
      <div></div>
    </div>
  );
}

export default Chats;
