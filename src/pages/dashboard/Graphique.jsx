import PropTypes from 'prop-types';
import React from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Graphique = ({ clients }) => {
  const [value, setValue] = React.useState();
  const loading = () => {
    const table = [];
    for (let i = 0; i < clients.length; i++) {
      table.push({
        name: clients[i]._id,
        value: clients[i].value
      });
    }
    setValue(table);
  };
  React.useEffect(() => {
    loading();
  }, [clients]);
  return (
    <div>
      {value && (
        <PieChart width={400} height={400}>
          <Pie data={value} cx={200} cy={150} innerRadius={60} outerRadius={120} fill="#8884d8" paddingAngle={0} dataKey="value">
            {value.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      )}
    </div>
  );
};

Graphique.propTypes = {
  clients: PropTypes.array
};
export default React.memo(Graphique);
