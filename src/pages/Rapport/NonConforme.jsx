import axios from 'axios';
import React from 'react';
import { big_data, config } from 'static/Lien';
// import Table from 'react-bootstrap/Table';
import dayjs from 'dayjs';
import './style.css';
// import ImageComponent from 'Control/ImageComponent';
import { Button, Grid } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import { useSelector } from 'react-redux';
import ExcelButton from 'static/ExcelButton';
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
      const response = await axios.post(big_data + '/conformite', { dataTosearch }, config);
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
  const [fileData, setFileData] = React.useState();
  const laodingFile = () => {
    try {
      const returnFeedback = (conversation) => {
        if (conversation.length > 0) {
          return conversation[conversation.length - 1]['message'];
        } else {
          return '';
        }
      };
      if (data) {
        let table = [];
        for (let i = 0; i < data.length; i++) {
          table.push({
            ID_Demande: data[i].idDemande,
            codeAgent: data[i].codeAgent,
            nom: data[i].agent.nom,
            shop: data[i].shop?.shop,
            commune: data[i].commune,
            sector: data[i].sector,
            cell: data[i].cell,
            sat: data[i].sat,
            date: dayjs(data[i].createdAt).format('DD/MM/YYYY'),
            feedback: returnFeedback(data[i].conversation)
          });
        }
        setFileData(table);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    laodingFile();
  }, [data]);
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
        <Grid item lg={4} sx={{ padding: '0px 10px' }}>
          {fileData && fileData.length > 0 && (
            <div style={{ width: '40%', marginLeft: '10px' }}>
              <ExcelButton data={fileData} title="" fileName="Non_conforme.xlsx" />
            </div>
          )}
        </Grid>
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
