import { Search } from '@mui/icons-material';
import { Button, Grid, Paper } from '@mui/material';
import AutoComplement from 'components/AutoComplete';
import React from 'react';
import { useSelector } from 'react-redux';
import { CreateContexteHome } from './Context';

function Filtre() {
  const zone = useSelector((state) => state.zone.zone);
  const [zoneSelect, setZoneSelect] = React.useState('');
  const [shop, setShop] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { setMatch, load } = React.useContext(CreateContexteHome);
  const fetchData = async () => {
    try {
      setLoading(true);
      const shops = shop?.shop;
      const region = zoneSelect?.denomination;
      let data = {};

      if (shops) {
        data.shop = shops;
      }
      if (region) {
        data.region = region;
      }
      setMatch(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Paper elevation={2} sx={{ padding: '10px', marginBottom: '10px' }}>
        <Grid container>
          <Grid item lg={2} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
            <AutoComplement value={zoneSelect} setValue={setZoneSelect} options={zone} title="Region" propr="denomination" />
          </Grid>
          {zoneSelect && (
            <Grid item lg={2} xs={6} sm={2} md={2} sx={{ padding: '2px' }}>
              <AutoComplement value={shop} setValue={setShop} options={zoneSelect?.shop} title="Shop" propr="shop" />
            </Grid>
          )}

          <Grid item lg={1} xs={6} sm={1} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button
              fullWidth
              disabled={load.un || load.deux || load.trois}
              onClick={() => fetchData(false)}
              color="primary"
              variant="contained"
            >
              <Search fontSize="small" />
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Filtre;
