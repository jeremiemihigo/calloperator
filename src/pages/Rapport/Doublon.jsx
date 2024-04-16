import React from 'react';
import axios from 'axios';
import { config, lien } from 'static/Lien';
import Table from 'react-bootstrap/Table';
import dayjs from 'dayjs';
import './style.css';
import { motion } from 'framer-motion';
import { Input } from 'antd';

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
      </div>
      {data && (
        <Table striped>
          <thead>
            <tr>
              <th rowSpan="2">code client</th>
              <th colSpan="4">Premiere soumission</th>
              <th colSpan="4">Deuxieme soumission</th>
              <th rowSpan="2">Feedback</th>
            </tr>
            <tr>
              <th>code agent</th>
              <th>Nom</th>
              <th>SAT</th>
              <th>Date</th>
              <th>code agent</th>
              <th>Nom</th>
              <th>SAT</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filterFn.fn(data).map((index, key) => {
              return (
                <motion.tr
                  initial={{ x: '-100vw' }}
                  animate={{ x: 0 }}
                  key={key}
                  transition={{ type: 'spring', delay: 0.5, duration: 5, stiffness: 80 }}
                >
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
                </motion.tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default Doublon;
