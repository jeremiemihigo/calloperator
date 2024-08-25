/* eslint-disable react/prop-types */
import { Input } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { lien } from 'static/Lien';
const { TextArea } = Input;

function FeedbackComponent({ demande, update }) {
  const [reclamation, setReclamation] = useState('');
  const user = useSelector((state) => state.user?.user);
  // const { socket } = React.useContext(CreateContexteGlobal);

  const sendReclamation = async (e) => {
    if (update && e.keyCode === 13 && reclamation !== '') {
      setReclamation('');
      const data = {
        message: reclamation,
        _id: update._id,
        idDemande: update.idDemande,
        sender: 'co',
        codeAgent: user?.codeAgent
      };
      // socket.emit('reponse', data);
      const response = await axios.post(lien + '/reclamation', data);
      if (response.status === 200) {
        return;
      }
    }
    if (demande && e.keyCode === 13 && reclamation !== '') {
      const data = {
        _id: demande._id,
        message: reclamation,
        sender: 'co',
        idDemande: demande.idDemande,
        codeAgent: user?.codeAgent
      };
      setReclamation('');
      const response = await axios.post(lien + '/reclamation', data);
      console.log(response);
      if (response.status === 200) {
        return;
      }
      // socket.emit('reponse', data);
    }
  };
  return (
    <div className="container">
      <div className="row">
        <TextArea
          required
          value={reclamation}
          onKeyUp={(e) => sendReclamation(e)}
          onChange={(e) => {
            e.preventDefault();
            setReclamation(e.target.value);
          }}
          placeholder="Messages"
          autoSize={{
            minRows: 3,
            maxRows: 5
          }}
        />
      </div>
    </div>
  );
}
export default FeedbackComponent;
