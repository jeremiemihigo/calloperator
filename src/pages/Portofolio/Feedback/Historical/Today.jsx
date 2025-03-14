import axios from 'axios';
import _ from 'lodash';
import React from 'react';
import { config, portofolio } from 'static/Lien';
import { ContextFeedback } from '../Context';
import './style.css';
function Today() {
  const { analyse, setAnalyse } = React.useContext(ContextFeedback);
  const loading = async () => {
    try {
      const response = await axios.get(portofolio + '/analysetoday', config);
      if (response.status === 200) {
        setAnalyse(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);
  return (
    <div style={{ marginTop: '10px' }}>
      <div className="container_today">
        <p className="number">{analyse ? _.filter(analyse, { type: 'Reachable' }).length : 0}</p>
        <p className="texte">Reachable</p>
      </div>
      <div className="container_today">
        <p className="number">{analyse ? _.filter(analyse, { type: 'Unreachable' }).length : 0}</p>
        <p className="texte">Unreachable</p>
      </div>
      <div className="container_today">
        <p className="number">{analyse ? _.filter(analyse, { type: 'Remind' }).length : 0}</p>
        <p className="texte">Remind</p>
      </div>
    </div>
  );
}

export default Today;
