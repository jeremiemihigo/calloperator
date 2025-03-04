import axios from 'axios';
import LoaderGif from 'components/LoaderGif';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_dt } from 'static/Lien';
import { returnFeedback, returnRole } from 'utils/function';

function TableRapport() {
  const [data, setData] = React.useState({ result: [], role: [] });
  const feedback = useSelector((state) => state.feedback.feedback);
  const roles = useSelector((state) => state.role.role);
  const { result, role } = data;
  const [load, setLoad] = React.useState(false);
  const loadingData = async () => {
    try {
      setLoad(true);
      const response = await axios.get(lien_dt + '/rapport', config);
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loadingData();
  }, []);
  React.useEffect(() => {
    const initiale = ['codeclient', 'Visited month?', 'Feedback This month'];
    role.map((x) => initiale.push(returnRole(roles, x)));
  }, [role]);

  React.useEffect(() => {}, []);
  return (
    <div>
      {load && <LoaderGif width={400} height={400} />}
      {!load && (
        <table>
          <thead>
            <tr>
              <td>#</td>
              <td>codeclient</td>
              <td>Visited month?</td>
              <td>Feedback This month</td>
              {role &&
                role.map((index) => {
                  return <td key={index}>{returnRole(roles, index)}</td>;
                })}
            </tr>
          </thead>
          <tbody>
            {result &&
              result.map((index, key) => {
                return (
                  <tr key={index._id}>
                    <td>{key + 1}</td>
                    <td>{index.codeclient}</td>
                    <td>{index.visiteMonth}</td>
                    <td>{index.last_feedback_VM}</td>
                    {role &&
                      role.map((item) => {
                        return <td key={item}>{returnFeedback(feedback, index['' + item])}</td>;
                      })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TableRapport;
