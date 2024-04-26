import React from 'react';
import axios from 'axios';
import { config, lien } from 'static/Lien';
import dayjs from 'dayjs';
import './style.css';
import { Input } from 'antd';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

function Doublon() {
  const [load, setLoad] = React.useState(false);
  const [data, setData] = React.useState();

  const laoding = async () => {
    try {
      setLoad(true);
      const response = await axios.get(lien + '/doublon', config);
      if (response.status === 200) {
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
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="btn btn-success"
              table="theTable"
              filename="Doublons"
              sheet="Feuil 1"
              buttonText={`Export to Excel, ${data.length}`}
            />
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
              <th rowSpan="2">Feedback</th>
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
                  <td>
                    {index.conversation.map((item) => {
                      return (
                        <p className="messageItem" key={item._id}>
                          {item.message}
                        </p>
                      );
                    })}
                  </td>
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
