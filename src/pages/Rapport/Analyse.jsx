/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';

function Analyse({ data }) {
  const returnValue = (type) => {
    return data.filter((x) => x.demandeur.fonction === type).length;
  };
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
              <td>SA</td>
              <td>Tech</td>
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
                      <td style={{ backgroundColor: '#dedede' }}>{loadingRegion(index.idZone, 'agent').agentTech}</td>
                      <td style={{ backgroundColor: '#dedede' }}>{loadingRegion(index.idZone, 'tech').agentTech}</td>
                      <td style={{ backgroundColor: '#dedede' }}>{loadingRegion(index.idZone).region}</td>
                    </tr>
                    {index.shop?.map((item, cle) => {
                      return (
                        <tr key={cle}>
                          <td>{item.shop}</td>
                          <td>{loadingShop(item.idShop, 'agent')}</td>
                          <td>{loadingShop(item.idShop, 'tech')}</td>
                          <td>{loadingShop(item.idShop, 'tech') + loadingShop(item.idShop, 'agent')}</td>
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
      )}
    </>
  );
}

export default Analyse;
