/* eslint-disable react/prop-types */
import { Card } from 'react-bootstrap';
import './style.css';
import React, { useContext } from 'react';
import { lien, config } from '../static/Lien';
import moment from 'moment';
import { CreateContexte } from '../Context';
import axios from 'axios';
import _ from 'lodash';

function DemandeListe() {
  const { setDemande, setElement } = useContext(CreateContexte);

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    let interval = setInterval(async () => {
      const res = await axios.get(`${lien}/touteDemande/0`, config);
      if (res.data != data) {
        setData(_.groupBy(res.data, 'zone.denomination'));
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="containerDemandes">
      {data &&
        Object.keys(data).map((index) => {
          return (
            <div key={index}>
              <div className="regionDemande">
                <p>
                  {index} <span className="nombre">{data['' + index].length}</span>{' '}
                </p>
              </div>
              {data['' + index].map((e, cle) => {
                return (
                  <Card
                    onClick={(event) => {
                      event.stopPropagation();
                      setDemande(e);
                      setElement(0);
                    }}
                    className="p-1 mb-1"
                    style={{ cursor: 'pointer' }}
                    key={cle}
                  >
                    <div className="allP">
                      <p className={e.concerne === '' ? 'black' : localStorage.getItem('bboxxSupprtCode') === e.concerne ? 'green' : 'red'}>
                        {' '}
                        {e.idDemande};{' '}
                      </p>
                      {e.codeClient && <p>Code client : {e.codeClient}</p>} <p> statut : {e.statut}</p>
                      {e.raison && <p>{e.raison}</p>}
                      <p>adresse : {e.sat}</p>
                      <p className="alignLeft">{moment(e.createdAt).fromNow()}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}

export default React.memo(DemandeListe);
