import { Button, Grid } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue } from 'static/Lien';

function Index() {
  const agentAdmin = useSelector((state) => _.filter(state.agentAdmin?.agentAdmin, { fonction: 'co', active: true }));
  const shop = useSelector((state) => state?.shop?.shop);
  const [shopSelect, setShopSelect] = React.useState([]);
  const [agentSelect, setAgentSelect] = React.useState();

  const selectShop = (i) => {
    if (shopSelect.includes(i)) {
      setShopSelect(shopSelect.filter((x) => x !== i));
    } else {
      setShopSelect([...shopSelect, i]);
    }
  };
  React.useEffect(() => {
    if (agentSelect && agentSelect?.synchro_shop && agentSelect?.synchro_shop.length > 0) {
      setShopSelect(agentSelect?.synchro_shop);
    } else {
      setShopSelect([]);
    }
  }, [agentSelect]);
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 10
    });
  };
  const AddSynchro = async (e) => {
    e.preventDefault();
    try {
      const data = {
        agent: agentSelect?.codeAgent,
        allShop: shopSelect
      };
      const response = await axios.post(lien_issue + '/addsynchro', data, config);
      if (response.status === 200) {
        success('Done', 'success');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Grid container>
      {contextHolder}
      <Grid item lg={4}>
        {agentAdmin &&
          agentAdmin.length > 0 &&
          agentAdmin.map((index) => {
            return (
              <FormGroup onClick={() => setAgentSelect(index)} key={index._id} sx={{ cursor: 'pointer' }}>
                <FormControlLabel
                  control={<Checkbox checked={agentSelect?.codeAgent === index.codeAgent} name={index.codeAgent} />}
                  label={index.nom}
                />
              </FormGroup>
            );
          })}
        <Button onClick={(e) => AddSynchro(e)} color="primary" variant="contained" fullWidth>
          Valider
        </Button>
      </Grid>
      <Grid item lg={8}>
        <Grid container>
          {shop &&
            shop.length > 0 &&
            shop.map((index) => {
              return (
                <Grid key={index._id} item lg={6}>
                  <FormGroup onClick={() => selectShop(index.shop)}>
                    <FormControlLabel
                      control={<Checkbox checked={shopSelect.includes(index.shop)} name={index.idShop} />}
                      label={index.shop}
                    />
                  </FormGroup>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Index;
