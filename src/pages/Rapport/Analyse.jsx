/* eslint-disable react/prop-types */
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';

function Analyse({ data }) {
  const returnValue = (type) => {
    return data.filter((x) => x.demandeur.fonction === type).length;
  };
  const [fonction] = React.useState(Object.keys(_.groupBy(data, 'demandeur.fonction')));

  const zones = useSelector((state) => state.zone.zone);
  const loadingRegion = (codeZone, fonction) => {
    let region = [];
    let agentTech = [];
    region = data.filter((x) => x.idZone === codeZone);
    agentTech = data.filter((x) => x.idZone === codeZone && x.demandeur.fonction === fonction);
    return { region: region.length, agentTech: agentTech.length };
  };
  const loadingShop = (idShop, fonction) => {
    return data.filter((x) => x.idShop === idShop && x.demandeur.fonction === fonction).length;
  };

  return (
    <>
      {zones && zones.length < 1 ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <td>Région/Shop</td>
              {fonction &&
                fonction.map((index) => {
                  return <td key={index}>{index}</td>;
                })}

              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            {zones &&
              zones.length > 0 &&
              zones.map((index, key) => {
                return (
                  <React.Fragment key={key}>
                    <tr>
                      <td style={{ backgroundColor: '#dedede' }}>{index.denomination}</td>
                      {fonction &&
                        fonction.map((item) => {
                          return (
                            <td key={item} style={{ backgroundColor: '#dedede' }}>
                              {loadingRegion(index.idZone, item).agentTech}
                            </td>
                          );
                        })}

                      <td style={{ backgroundColor: '#dedede' }}>{loadingRegion(index.idZone).region}</td>
                    </tr>
                    {index.shop?.map((item, cle) => {
                      return (
                        <tr key={cle}>
                          <td>{item.shop}</td>
                          {fonction &&
                            fonction.map((items) => {
                              return <td key={item}>{loadingShop(item.idShop, items)}</td>;
                            })}

                          <td>{loadingShop(item.idShop, 'tech') + loadingShop(item.idShop, 'agent')}</td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            <tr className="total">
              <td>Total général</td>
              {fonction &&
                fonction.map((item) => {
                  return <td key={item}>{returnValue(item)}</td>;
                })}

              <td>{data.length}</td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}

export default Analyse;
