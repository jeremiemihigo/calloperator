import { Input } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React from 'react';
import ExcelButton from 'static/ExcelButton';
import { big_data, config } from 'static/Lien';
import './style.css';

function Doublon() {
  const [load, setLoad] = React.useState(false);
  const [file, setFile] = React.useState();

  const laoding = async () => {
    try {
      setLoad(true);
      const response = await axios.get(big_data + '/doublon', config);
      console.log(response);
      if (response.status === 200) {
        let d = [];
        for (let i = 0; i < response.data.length; i++) {
          d.push({
            codeclient: response.data[i].precedent.codeclient,
            premier_visiteur: response.data[i].precedent.demandeur.codeAgent,
            premier_feedback: response.data[i].precedent.demande.raison,
            premiere_date: dayjs(response.data[i].precedent.demande.updatedAt).format('DD/MM/YYYY'),
            deuxieme_codeAgent: response.data[i].presents.codeAgent,
            deuxieme_feedback: response.data[i].presents.raison,
            deuxieme_date: dayjs(response.data[i].createdAt).format('DD/MM/YYYY')
          });
        }
        setFile(d);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
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
  console.log(file);
  const handleChanges = (e) => {
    let target = e.target.value.toUpperCase();

    setFilterFn({
      fn: (items) => {
        if (target === '') {
          return items;
        } else {
          return items.filter((x) => x.codeclient.includes(target));
        }
      }
    });
  };
  return (
    <div>
      {load && <p style={{ textAlign: 'center', fontSize: '13px', color: 'blue', fontWeight: 'bolder' }}>Please wait...</p>}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40%' }}>
          <Input onChange={(e) => handleChanges(e)} placeholder="Cherchez le Code client" />
        </div>
        {file && file.length > 0 && (
          <div style={{ width: '40%', marginLeft: '10px' }}>
            <ExcelButton data={file} title="Doublon" fileName="Doublon.xlsx" />
          </div>
        )}
      </div>
      {file && (
        <table id="theTable">
          <thead>
            <tr>
              <th>code client</th>
              <th>codeAgent</th>
              <th>Premier feedback</th>

              <th>Deuxieme codeAgent</th>
              <th>Deuxieme Feedback</th>
              <th>Deuxieme Date</th>
            </tr>
          </thead>
          <tbody>
            {filterFn.fn(file).map((index, key) => {
              return (
                <tr key={key}>
                  <td>{index.codeclient}</td>
                  <td>{index.premier_visiteur}</td>
                  <td>{index.premier_feedback}</td>
                  <td>{index.premiere_date}</td>
                  <td>{index.deuxieme_codeAgent}</td>

                  <td>{index.deuxieme_feedback}</td>
                  <td>{index.deuxieme_date}</td>
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
