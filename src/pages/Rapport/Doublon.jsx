import { Input } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React from 'react';
import ExcelButton from 'static/ExcelButton';
import { big_data, config } from 'static/Lien';
import './style.css';

function Doublon() {
  const [load, setLoad] = React.useState(false);
  const [data, setData] = React.useState();
  const [file, setFile] = React.useState();

  const laoding = async () => {
    try {
      setLoad(true);
      const response = await axios.get(big_data + '/doublon', config);
      if (response.status === 200) {
        let d = [];
        for (let i = 0; i < response.data.length; i++) {
          d.push({
            codeclient: response.data[i].codeclient,
            agent1: response.data[i].agentPrecedent.codeAgent,
            nom1: response.data[i].agentPrecedent.nom,
            sat1: response.data[i].precedent.sat,
            date1: dayjs(response.data[i].precedent.createdAt).format('DD/MM/YYYY'),
            agent2: response.data[i].agentPresent.codeAgent,
            nom2: response.data[i].agentPresent.nom,
            sat2: response.data[i].presents.sat,
            shop2: response.data[i].PresentShop[0].shop,
            date2: dayjs(response.data[i].presents.createdAt).format('DD/MM/YYYY')
          });
        }
        setFile(d);
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      if (error) {
        setLoad(false);
      }
    }
  };
  React.useEffect(() => {
    laoding();
  }, []);
  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    }
  });
  const handleChanges = (e) => {
    let target = e.target.value.toUpperCase();

    setFilterFn({
      fn: (items) => {
        if (target === '') {
          return items;
        } else {
          return items.filter((x) => x.codeclient.includes(target) || x.agentPresent.codeAgent.includes(target));
        }
      }
    });
  };
  return (
    <div>
      {load && <p style={{ textAlign: 'center', fontSize: '13px', color: 'blue', fontWeight: 'bolder' }}>Please wait...</p>}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40%' }}>
          <Input onChange={(e) => handleChanges(e)} placeholder="Cherchez le Code client ou le deuxieme agent" />
        </div>
        {data && data.length > 0 && (
          <div style={{ width: '40%', marginLeft: '10px' }}>
            <ExcelButton data={file} title="Doublon" fileName="Doublon.xlsx" />
          </div>
        )}
      </div>
      {data && (
        <table id="theTable">
          <thead>
            <tr>
              <th rowSpan="2">ID</th>
              <th colSpan="4" style={{ textAlign: 'center' }}>
                Premiere soumission
              </th>
              <th colSpan="4" style={{ textAlign: 'center' }}>
                Deuxieme soumission
              </th>
            </tr>
            <tr>
              <th>agent</th>
              <th>Nom</th>
              <th>SAT</th>
              <th>Date</th>
              <th>agent</th>
              <th>Nom</th>
              <th>SAT</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filterFn.fn(data).map((index, key) => {
              return (
                <tr key={key}>
                  <td>{index.codeclient}</td>
                  <td>{index.agentPrecedent.codeAgent}</td>
                  <td>{index.agentPrecedent.nom}</td>
                  <td>{index.precedent.sat}</td>

                  <td>{dayjs(index.precedent.createdAt).format('DD/MM/YYYY')}</td>
                  <td>{index.agentPresent.codeAgent}</td>
                  <td>{index.agentPresent.nom}</td>
                  <td>{index.presents.sat}</td>
                  <td>{dayjs(index.presents.createdAt).format('DD/MM/YYYY')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Doublon;
