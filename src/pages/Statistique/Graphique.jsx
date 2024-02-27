/* eslint-disable react/prop-types */
import { memo, useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import _ from 'lodash';
import { Grid } from '@mui/material';

function Graphique({ donner, recherche }) {
  const [allDatas, setDatas] = useState({ datas: [] });
  const { datas } = allDatas;
  const loading = () => {
    let table = [];
    const agentTech = _.groupBy(donner, 'zone.denomination');

    let cle = Object.keys(agentTech);
    for (let i = 0; i < cle.length; i++) {
      table.push({
        region: cle[i],
        agent: agentTech['' + cle[i]].filter((x) => x.agent.fonction === 'agent').length,
        tech: agentTech['' + cle[i]].filter((x) => x.agent.fonction === 'tech').length
      });
    }
    setDatas({
      datas: table
    });
  };
  useEffect(() => {
    loading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donner]);

  return (
    <Grid container sx={{ height: '25rem' }}>
      <Grid item lg={12}>
        {!recherche.codeAgent && (
          <ResponsiveContainer width="100%">
            <BarChart data={datas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="agent" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
              <Bar dataKey="tech" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Grid>
    </Grid>
  );
}
export default memo(Graphique);
