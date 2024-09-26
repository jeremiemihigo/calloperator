import moment from 'moment';
import { TextField } from '../../../../../node_modules/@mui/material/index';
import './chat.style.css';

function Index() {
  return (
    <div className="chat_container">
      <div className="his_message message">
        <p className="content content_his_message">je suis un message envoyée par le call center</p>
        <p className="time_to_send">{moment(new Date()).fromNow()}</p>
      </div>
      <div className="my_message message">
        <p className="content content_my_message">je suis un message envoyée par moi meme</p>
        <p className="time_to_send">{moment(new Date()).fromNow()}</p>
      </div>
      <div className="inputMessage">
        <TextField fullWidth placeholder="Message" />
      </div>
    </div>
  );
}

export default Index;
