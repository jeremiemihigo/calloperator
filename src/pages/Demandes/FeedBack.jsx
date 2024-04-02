/* eslint-disable react/prop-types */
import axios from 'axios';
import { useState } from 'react';
import { lien, config } from 'static/Lien';
import { Input } from 'antd';
import { useSelector } from 'react-redux';
const { TextArea } = Input;

function FeedbackComponent({ demande, update }) {
  const [reclamation, setReclamation] = useState('');
  const user = useSelector((state) => state.user?.user);

  const sendReclamation = (e) => {
    if (update && e.keyCode === 13 && reclamation !== '') {
      setReclamation('');
      const data = {
        _id: update.demande._id,
        message: reclamation,
        sender: 'co',
        codeAgent: user?.codeAgent
      };
      axios
        .post(lien + '/reclamation', data, config)
        .then(() => {
          setReclamation('');
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    if (demande && e.keyCode === 13 && reclamation !== '') {
      setReclamation('');
      const data = {
        _id: demande._id,
        message: reclamation,
        sender: 'co',
        codeAgent: user?.codeAgent
      };
      axios
        .post(lien + '/reclamation', data, config)
        .then(() => {
          setReclamation('');
        })
        .catch(function (err) {
          console.log(err);
        });
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
          placeholder="Message"
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
