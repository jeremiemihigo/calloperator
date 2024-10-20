import { Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue, returnName } from 'static/Lien';
import './chat.style.css';

function Index() {
  const [reclamation, setReclamation] = React.useState('');
  const [lastMessage, setLastMessage] = React.useState();
  const user = useSelector((state) => state.user?.user);

  const [donner, setDonner] = React.useState();
  const loading = async () => {
    try {
      const response = await axios.get(lien_issue + '/notification_reader', config);
      if (response.status === 200) {
        setDonner(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);
  const sendReclamation = async (e) => {
    if (e.keyCode === 13 && reclamation !== '') {
      const data = {
        lastMessage: lastMessage?.content,
        idPlainte: lastMessage?.idPlainte,
        lastAgent: lastMessage?.agent,
        content: reclamation,
        type: 'feedback'
      };
      const response = await axios.post(lien_issue + '/message', data, config);
      if (response.status === 200) {
        setReclamation('');
        setLastMessage();
        return;
      }
    }
  };
  const ReturnComponentHisMessage = (props) => {
    const { content, agent, plainte, createdAt } = props.index;
    return (
      <div className="message his_message">
        <div className="identification">
          <Typography noWrap className="name">
            {returnName(agent)}; {plainte?.codeclient}
          </Typography>
          <div className="footer">
            <p className="time_to_send">{moment(createdAt).fromNow()}</p>
            <Typography className="reponsebtn" component="p" onClick={() => setLastMessage(props.index)}>
              Repondre
            </Typography>
          </div>
        </div>
        <p className="content content_his_message">{content}</p>
      </div>
    );
  };

  const { socket } = React.useContext(CreateContexteGlobal);
  const [change, setChange] = React.useState();
  React.useEffect(() => {
    socket?.on('message', (a) => {
      setChange(a);
    });
  }, [socket]);
  React.useEffect(() => {
    if (change) {
      setDonner([...donner, change]);
    }
  }, [change]);

  const ReturnMyMessage = (props) => {
    const { content, createdAt, plainte, lastMessage } = props.content;
    return (
      <div className="my_message message">
        <div className="identification">
          <Typography noWrap className="name">
            Moi; {plainte?.codeclient}
          </Typography>
          <div className="footer">
            <p className="time_to_send">{moment(createdAt).fromNow()}</p>
            <Typography onClick={() => setLastMessage(props.index)} className="reponsebtn">
              Repondre
            </Typography>
          </div>
        </div>
        <Typography className="lasMessage">{lastMessage && lastMessage.substr(0, 20) + '...'}</Typography>
        <p className="content content_my_message">{content}</p>
      </div>
    );
  };
  return (
    <div id="maincontent">
      <div className="chat_container">
        {donner &&
          user &&
          donner.length > 0 &&
          donner.map((index, key) => {
            return (
              <React.Fragment key={key}>
                {index?.agent === user.nom ? <ReturnMyMessage content={index} /> : <ReturnComponentHisMessage index={index} />}
              </React.Fragment>
            );
          })}
        {lastMessage && (
          <div className="inputMessage">
            <Paper sx={{ padding: '5px' }} className="contentPaper">
              <Typography component="p" noWrap>
                {lastMessage?.content}
              </Typography>
              <TextField
                onChange={(e) => setReclamation(e.target.value)}
                onKeyUp={(e) => sendReclamation(e)}
                fullWidth
                placeholder="Message"
              />
            </Paper>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
