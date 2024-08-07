import axios from 'axios';
import React from 'react';
import { config, lien, lien_image } from 'static/Lien';
// import Table from 'react-bootstrap/Table';
import dayjs from 'dayjs';
import './style.css';
// import ImageComponent from 'Control/ImageComponent';
import { Button, Grid } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import ImageComponent from 'Control/ImageComponent';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { useSelector } from 'react-redux';
import Selected from 'static/Select';

function Doublon() {
  const [load, setLoad] = React.useState(false);
  const [data, setData] = React.useState();

  const [valueSelect, setValueSelect] = React.useState('');
  const shop = useSelector((state) => state.shop?.shop);
  const region = useSelector((state) => state.zone?.zone);
  const [idShop, setValeurShop] = React.useState('');
  const [idZone, setValeurRegion] = React.useState('');

  const select = [
    { id: 1, title: 'Shop', value: 'idShop' },
    { id: 2, title: 'Region', value: 'codeZone' },
    { id: 3, title: 'Overall', value: 'overall' }
  ];

  const laoding = async (e) => {
    e.preventDefault();
    try {
      setLoad(true);
      let recherche = {};
      recherche.key = valueSelect;
      recherche.value = valueSelect === 'idShop' ? idShop?.idShop : valueSelect === 'codeZone' && idZone?.idZone;
      let dataTosearch = {};
      if (recherche.key !== 'overall') {
        dataTosearch.key = recherche.key;
        dataTosearch.value = recherche.value;
      }
      const response = await axios.post(lien + '/conformite', { dataTosearch }, config);
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

  return (
    <div>
      <Grid container>
        <Grid item lg={3}>
          <Selected label="Filtrer par" data={select} value={valueSelect} setValue={setValueSelect} />
        </Grid>
        {region && valueSelect === 'codeZone' && (
          <Grid item lg={3} sx={{ padding: '0px 10px' }}>
            <AutoComplement
              value={idZone}
              setValue={setValeurRegion}
              options={region}
              title="Selectionnez la region"
              propr="denomination"
            />
          </Grid>
        )}
        {shop && valueSelect === 'idShop' && (
          <Grid item lg={3} sx={{ padding: '0px 10px' }}>
            <AutoComplement value={idShop} setValue={setValeurShop} options={shop} title="Selectionnez le shop" propr="shop" />
          </Grid>
        )}

        <Grid item lg={2} sx={{ padding: '0px 10px' }}>
          <Button variant="contained" color="primary" onClick={(e) => laoding(e)}>
            Chercher
          </Button>
        </Grid>
        {data && data.length > 0 && (
          <Grid item lg={2} sx={{ padding: '0px 10px', paddingLeft: '10px' }}>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="btn btn-success"
              table="theTable"
              filename="Non conforme"
              sheet="Feuil 1"
              buttonText={`Export to Excel, ${data.length}`}
            />
          </Grid>
        )}
      </Grid>
      {load && <p style={{ textAlign: 'center', fontSize: '13px', color: 'blue', fontWeight: 'bolder' }}>Please wait...</p>}
      {data && (
        <table id="theTable">
          <thead>
            <tr>
              <th>ID demande</th>
              <th>SA |TECH</th>
              <th>Name</th>
              <th>Commune</th>
              <th>Secteur</th>
              <th>Cell</th>
              <th>SAT</th>
              <th>Date</th>
              <th>Feedback</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {data.map((index, key) => {
              return (
                <tr key={key}>
                  <td>{index.idDemande}</td>
                  <td>{index.codeAgent}</td>
                  <td>{index.agent.nom}</td>
                  <td>{index.commune}</td>
                  <td>{index.sector}</td>
                  <td>{index.cell}</td>
                  <td>{index.sat}</td>
                  <td>{dayjs(index.createdAt).format('DD/MM/YYYY')}</td>

                  <td>
                    {index.conversation.map((item) => {
                      return (
                        <p className="messageItem" key={item._id}>
                          {item.message}
                        </p>
                      );
                    })}
                  </td>
                  <td>
                    <ImageComponent src={lien_image + '/' + index.file} taille={70} />
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
