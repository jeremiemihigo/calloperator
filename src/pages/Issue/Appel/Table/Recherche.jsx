import { Search, SearchOutlined } from '@mui/icons-material';
import { Button, FormControl, Grid, InputAdornment, OutlinedInput, Paper, Typography } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import SimpleBackdrop from 'Control/Backdrop';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue, returnName } from 'static/Lien';
import InfoCustomer from '../Component/InfoCustomer';

function Recherche() {
  const [value, setValue] = React.useState('');
  const user = useSelector((state) => state.user.user);
  const [plainteSelect, setData] = React.useState();
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 5
    });
  };
  const [fetch, setFetch] = React.useState(false);
  const loading = async (e) => {
    e.preventDefault();
    setFetch(true);
    setData();
    const response = await axios.get(lien_issue + '/onecomplaint/' + value, config);
    if (response.status === 200) {
      setData(response.data[0]);
      setFetch(false);
    } else {
      success('' + response.data, 'error');
      setFetch(false);
    }
  };
  return (
    <>
      {contextHolder}
      {fetch && <SimpleBackdrop open={true} title="Please wait..." taille="10rem" />}
      <Paper elevation={2} sx={{ padding: '10px' }}>
        <Grid container>
          <Grid item lg={8}>
            <FormControl sx={{ width: '100%' }}>
              <OutlinedInput
                size="small"
                id="header-search"
                startAdornment={
                  <InputAdornment position="start" sx={{ mr: -0.5 }}>
                    <SearchOutlined />
                  </InputAdornment>
                }
                aria-describedby="header-search-text"
                inputProps={{
                  'aria-label': 'weight'
                }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                // onKeyUp={(e) => postData(e)}
                placeholder="ID Complaint"
              />
            </FormControl>

            {/* <Input label="Recherche" setValue, value={value} showIcon type="text" value={value} onChange={(e) => key(e)} onKeyUp={(e) => postData(e)} placeholder="Account ID" /> */}
          </Grid>
          <Grid item lg={2} sx={{ paddingLeft: '10px' }}>
            <Button onClick={(e) => loading(e)} variant="contained" color="primary">
              <Search fontSize="small" /> Recherche
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {plainteSelect && (
        <Grid container>
          <Grid item lg={7} xs={12} sm={4} md={4}>
            <InfoCustomer plainteSelect={plainteSelect} />

            <Paper sx={{ padding: '10px', marginTop: '4px' }}>
              {plainteSelect &&
                plainteSelect?.resultat?.length > 0 &&
                plainteSelect?.resultat.map((index) => {
                  return (
                    <div key={index._id} className="resultat">
                      <div>
                        <p>
                          <span>last_status : </span>
                          {index?.laststatus}
                        </p>
                        <p>
                          <span>change_to : </span>
                          {index?.changeto}
                        </p>
                        <p>
                          <span>Do_by : </span>
                          {index?.nomAgent}
                        </p>
                        <p>
                          <span>SLA : </span>
                          {index?.delai}
                        </p>
                        <p>
                          <span>Comment : </span>
                          {index?.commentaire}
                        </p>
                        <p>
                          <span>Date : </span>
                          {moment(index?.fullDate).format('DD/MM/YYYY hh:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </Paper>
          </Grid>
          <Grid item lg={5}>
            <div>
              {plainteSelect?.message &&
                plainteSelect?.message.map((index) => {
                  return (
                    <Paper elevation={2} key={index._id} className="papierConv">
                      <Grid container>
                        <Grid item lg={2} className="userP">
                          <div>
                            <Typography noWrap component="p">
                              {index.agent === user.nom ? 'Moi' : returnName(index.agent)}
                            </Typography>
                          </div>
                        </Grid>
                        <Grid item lg={10} className="body_content">
                          <p>{index.content}</p>
                          <p style={{ fontSize: '10px' }}>{moment(index.createdAt).fromNow()}</p>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}
            </div>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default React.memo(Recherche);
