import { Typography } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { retourneRole, returnFeedback } from 'utils/function';
import './status.style.css';

function Index({ data }) {
  const feedback = useSelector((state) => state.feedback.feedback);
  const roles = useSelector((state) => state.role.role);
  const [tableau, setTableau] = React.useState();

  React.useEffect(() => {
    if (feedback && roles) {
      let status = Object.keys(_.groupBy(data, 'currentFeedback'));
      let table = status.map(function (y) {
        return {
          currentstatus: y,
          incharge: retourneRole(y, feedback, roles),
          action: data.filter((x) => x.currentFeedback === y && x.action.length > 0),
          non_action: data.filter((x) => x.currentFeedback === y && x.action.length === 0)
        };
      });
      setTableau(table);
    }
  }, [data]);

  const total = (title) => {
    if (title === 'action') {
      return data.filter((x) => x.action.length > 0);
    }
    if (title === 'no_action') {
      return data.filter((x) => x.action.length === 0);
    }
    if (title === 'total') {
      return data;
    }
  };
  const navigate = useNavigate();
  const functionListe = (customers) => {
    if (customers.length > 0) {
      let bdrc = customers.map((x) => x.codeclient);
      navigate('/customers', { state: { customers: bdrc } });
    }
  };

  return (
    <div className="statusDash">
      {tableau && tableau.length > 0 && (
        <table>
          <thead>
            <tr>
              <td>Current status</td>
              <td>In charge</td>
              <td>Action</td>
              <td>No action</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            {tableau.map((index) => {
              return (
                <tr key={index.currentstatus}>
                  <td>{returnFeedback(feedback, index.currentstatus)}</td>
                  <td>
                    <Typography noWrap>{index.incharge}</Typography>
                  </td>
                  <td onClick={() => functionListe(index.action)} className="action">
                    {index.action.length}
                  </td>
                  <td onClick={() => functionListe(index.non_action)} className="no_action">
                    {index.non_action.length}
                  </td>
                  <td>{index.non_action.length + index.action.length}</td>
                </tr>
              );
            })}
            <tr>
              <td rowSpan="2" className="total">
                Total
              </td>
              <td className="total"></td>
              <td>{total('action').length}</td>
              <td>{total('no_action').length}</td>
              <td>{total('total').length}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Index;
