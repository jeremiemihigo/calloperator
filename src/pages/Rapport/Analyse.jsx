/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';

function Analyse({ data }) {
  const returnValue = (type) => {
    return data.filter((x) => x.demandeur.fonction === type).length;
  };
  const [region, setRegion] = React.useState();
  const loading = () => {
    let region = _.groupBy(data, 'region');
    let regions = Object.keys(region);
    let table = [];
    for (let i = 0; i < regions.length; i++) {
      table.push({
        region: regions[i],
        technicien: region['' + regions[i]].filter((x) => x.demandeur.fonction === 'tech').length,
        agents: region['' + regions[i]].filter((x) => x.demandeur.fonction === 'agent').length
      });
    }
    setRegion(table);
  };
  React.useEffect(() => {
    loading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const retournShop = (item) => {
    //item = region
    let tableau = [];
    let region = _.filter(data, { region: item });
    let shop = Object.keys(_.groupBy(region, 'shop'));
    for (let i = 0; i < shop.length; i++) {
      tableau.push({
        shop: shop[i],
        agent: region.filter((x) => x.shop === shop[i] && x.demandeur.fonction == 'agent').length,
        tech: region.filter((x) => x.shop === shop[i] && x.demandeur.fonction == 'tech').length
      });
    }
    return tableau;
  };
  return (
    <table>
      <thead>
        <tr>
          <td>Région/Shop</td>
          <td>Agents</td>
          <td>Techniciens</td>
          <td>Total</td>
        </tr>
      </thead>
      <tbody>
        {region &&
          region.map((index, key) => {
            return (
              <React.Fragment key={key}>
                <tr>
                  <td style={{ backgroundColor: '#dedede' }}>{index.region}</td>
                  <td style={{ backgroundColor: '#dedede' }}>{index.agents}</td>
                  <td style={{ backgroundColor: '#dedede' }}>{index.technicien}</td>
                  <td style={{ backgroundColor: '#dedede' }}>{index.technicien + index.agents}</td>
                </tr>
                {retournShop(index.region).map((item, cle) => {
                  return (
                    <tr key={cle}>
                      <td>{item.shop}</td>
                      <td>{item.agent}</td>
                      <td>{item.tech}</td>
                      <td>{item.tech + item.agent}</td>
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        <tr className="total">
          <td>Total général</td>
          <td>{returnValue('agent')}</td>
          <td>{returnValue('tech')}</td>
          <td>{returnValue('tech') + returnValue('agent')}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Analyse;
