import { Message } from '@mui/icons-material';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Ajoutercommunication } from 'Redux/Communication';
import { returnName } from 'static/Lien';
import './communication.style.css';

function Index() {
  const [title, setTitle] = React.useState('');
  const user = useSelector((state) => state.user.user);
  const communiquer = useSelector((state) => state.communication.communication);
  const [content, setContent] = React.useState('');
  const [file, setFile] = React.useState();
  const dispatch = useDispatch();
  console.log(communiquer);
  const sendData = async (e) => {
    try {
      e.preventDefault();
      const data = new FormData();
      data.append('title', title);
      data.append('content', content);
      data.append('file', file);
      dispatch(Ajoutercommunication(data));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Grid container>
        <Grid item lg={4}>
          <div style={{ marginBottom: '5px' }}>
            <TextField
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginTop: '10px' }}
              name="title"
              autoComplete="off"
              fullWidth
              label="Title"
            />
          </div>
          <div style={{ marginBottom: '5px' }}>
            <TextField
              onChange={(e) => setContent(e.target.value)}
              style={{ marginTop: '10px' }}
              name="content"
              autoComplete="off"
              fullWidth
              label="Content"
            />
          </div>
          <Grid sx={{ paddingLeft: '10px' }}>
            <input
              onChange={(event) => {
                const file = event.target.files[0];
                setFile(file);
              }}
              type="file"
              id="actual-btn"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <label className="label" htmlFor="actual-btn">
              Clic here to attach a file
            </label>
          </Grid>
          <Grid sx={{ marginTop: '10px' }}>
            <Button onClick={(e) => sendData(e)} fullWidth color="primary" variant="contained">
              <Message fontSize="small" sx={{ marginRight: '15px' }} />
              Create_message
            </Button>
          </Grid>
        </Grid>
        <Grid item lg={8} sx={{ padding: '5px' }}>
          {communiquer &&
            communiquer.map((index) => {
              return (
                <Paper key={index._id} sx={{ padding: '10px' }}>
                  <Paper sx={{ padding: '5px' }}>
                    <Typography variant="body" sx={{ textAlign: 'center', fontWeight: 'bolder' }}>
                      {index.title}
                    </Typography>
                    <p>{index.content.replace('@name', returnName(user?.nom))}</p>
                  </Paper>
                </Paper>
              );
            })}
        </Grid>
      </Grid>
    </>
  );
}

export default Index;
