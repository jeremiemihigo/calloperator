import { Search } from '@mui/icons-material';
import { Button, Grid, Paper } from '@mui/material';
import axios from 'axios';
import Dotchiffre from 'components/@extended/Dotchiffre';
import AutoComplement from 'components/AutoComplete';
import ExcelFile from 'components/ExcelFile';
import LoaderGif from 'components/LoaderGif';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_dt } from 'static/Lien';
import './performance.style.css';

function Performance() {
  const [data, setData] = React.useState({
    performance: [],
    today: '',
    lastDate: ''
  });
  const { performance, today, lastDate } = data;
  const [table, setTable] = React.useState();
  let last = `MTD ${moment(lastDate).format('DD-MM-YY')}`;
  let now = `MTD ${moment(today).format('DD-MM-YY')}`;
  const zone = useSelector((state) => state.zone.zone);
  const returnZone = (region) => {
    if (zone.length > 0) {
      return _.filter(zone, { idZone: region })[0]?.denomination;
    } else {
      return '';
    }
  };
  const returnShop = (region, idShop) => {
    if (zone.length > 0) {
      let allshop = _.filter(zone, { idZone: region })[0]?.shop;
      return _.filter(allshop, { idShop })[0]?.shop;
    } else {
      return '';
    }
  };
  const number = (n) => {
    if (isNaN(n) || n == Infinity) {
      return 0;
    } else {
      return n;
    }
  };
  const objectifVisited = (agent) => {
    if (agent.codeAgent === 'CD1239') {
      console.log(agent);
    }

    return { visited: 0, object_no: 0 };
  };

  React.useEffect(() => {
    if (performance.length > 0 && zone.length > 0) {
      let structure = performance.map(function (x, key) {
        return {
          id: key,
          code_agent: x.codeAgent,
          agent_name: x.nom,
          phone_number: x.telephone,
          type_agent: x.fonction === 'agent' ? 'PA' : x.fonction,
          shop_name: returnShop(x.codeZone, x.idShop),
          region: returnZone(x.codeZone),
          [last]: x.size_lastmonth,
          [now]: x.size_thismonth,
          gap_visit: number((((x.size_thismonth - x.size_lastmonth) * 100) / x.size_lastmonth).toFixed(0)),
          tot_objectif: x.size_objet,
          objectif_visited: objectifVisited(x).visited,
          objectif_no_visited: objectifVisited(x).object_no
        };
      });
      setTable(structure);
    }
  }, [performance, zone]);

  const [load, setLoad] = React.useState(false);
  const [valuefilter, setValueFilter] = React.useState({ id: 1, title: 'Region', value: 'codeZone' });

  const [value, setValue] = React.useState('');

  const returnValeur = () => {
    if (valuefilter.value === 'codeZone') {
      return value.idZone;
    }
    if (valuefilter.value === 'idShop') {
      return value.idShop;
    }
    if (valuefilter.value === 'codeAgent') {
      return value.codeAgent;
    }
  };

  const laoding = async () => {
    try {
      setLoad(true);
      setTable();
      const { value } = valuefilter;
      let valeur = returnValeur();
      const response = await axios.post(
        lien_dt + '/performance_agent',
        {
          data: {
            [value]: valeur
          }
        },
        config
      );
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const region = useSelector((state) => state.zone.zone);
  const agent = useSelector((state) => state.agent.agent);
  const shop = useSelector((state) => state.shop.shop);
  const FilterBy = [
    { id: 1, title: 'Region', value: 'codeZone' },
    { id: 2, title: 'Shop', value: 'idShop' },
    { id: 3, title: 'Agent', value: 'codeAgent' }
  ];

  React.useEffect(() => {
    setValue('');
  }, [valuefilter]);

  return (
    <>
      <Paper elevation={2} sx={{ padding: '10px', marginBottom: '10px' }}>
        <Grid container>
          <Grid item lg={2} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
            <AutoComplement value={valuefilter} setValue={setValueFilter} options={FilterBy} title="Filter by" propr="title" />
          </Grid>
          {valuefilter && valuefilter?.value === 'codeZone' && region && (
            <Grid item lg={4} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
              <AutoComplement value={value} setValue={setValue} options={region} title="Region" propr="denomination" />
            </Grid>
          )}
          {valuefilter && valuefilter?.value === 'idShop' && shop && (
            <Grid item lg={4} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
              <AutoComplement value={value} setValue={setValue} options={shop} title="Shop" propr="shop" />
            </Grid>
          )}
          {valuefilter && valuefilter?.value === 'codeAgent' && agent && (
            <Grid item lg={4} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
              <AutoComplement value={value} setValue={setValue} options={agent} title="Region" propr="nom" />
            </Grid>
          )}
          {table && table.length > 0 && (
            <Grid item lg={2} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
              <ExcelFile data={table} fileName="Performance_des_agents" />
            </Grid>
          )}
          {value && (
            <Grid item lg={1} xs={6} sm={2} md={2} sx={{ padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button onClick={() => laoding()} color="primary" variant="contained">
                <Search fontSize="small" />
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
      {load && <LoaderGif width={300} height={300} />}
      <Paper elevation={3}>
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>Agent_name</td>
              <td>Contact</td>
              <td>Type</td>
              <td>Shop</td>
              <td>Region</td>
              <td>{last}</td>
              <td>{now}</td>
              <td>GAP_VM</td>
              <td>Obj_visited</td>
              <td>Obj_visited_by_others</td>
              <td>Not_visited_obj</td>
              <td>Total_to_track</td>
              <td>VM target_en_MTD</td>
              <td>%visit_vs_target</td>
              <td>Current_visit_target</td>
              <td>Notes_on_visits</td>
              <td>All_action</td>
              <td>opt_out</td>
              <td>Total_to_track_without_opt_out</td>
              <td>Total_no_action</td>
              <td>No_action_visited</td>
              <td>%_No_action_visit/total_to_track</td>
              <td>%_realisation_action</td>
              <td>Pojection</td>
              <td>Notes_for_actions</td>
            </tr>
          </thead>
          <tbody>
            {table &&
              table.map((index) => {
                return (
                  <tr key={index.id}>
                    <td>{index.code_agent}</td>
                    <td>{index.agent_name}</td>
                    <td>{index.phone_number}</td>
                    <td>{index.type_agent}</td>
                    <td>{index.shop_name}</td>
                    <td>{index.region}</td>
                    <td>{index['' + last]}</td>
                    <td>{index['' + now]}</td>
                    <td>
                      <Dotchiffre nombre={parseInt(index.gap_visit)} />
                    </td>
                    <td>{index.objectif_visited}</td>
                    <td>wait</td>
                    <td>{index.objectif_no_visited}</td>
                    <td>{index.tot_objectif}</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                    <td>wait</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Paper>
    </>
  );
}

export default Performance;
