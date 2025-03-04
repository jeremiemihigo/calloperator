import { Button, Menu, TextField, alpha, styled } from '@mui/material';
import Dot from 'components/@extended/Dot';
import AutoComplement from 'components/AutoComplete';
import SimpleBackdrop from 'components/Backdrop';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_dt } from 'static/Lien';
import { Box } from '../../../node_modules/@mui/material/index';
import axios from '../../../node_modules/axios/index';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}));

function Options({ client, allclient, setClient }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const feedback = useSelector((state) => state.feedback.feedback);
  const [value, setValue] = React.useState('');
  const [commentaire, setCommentaire] = React.useState('');
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [sending, setSending] = React.useState(false);
  const changeFeedback = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const data = {
        id: client._id,
        lastFeedback: client.idFeedback,
        nextFeedback: value?.idFeedback,
        commentaire
      };
      const response = await axios.post(lien_dt + '/changefeedback', data, config);
      if (response.status === 200) {
        setClient(allclient.filter((x) => x.codeclient !== response.data.codeclient));
        setSending(false);
        setValue('');
        setCommentaire('');
        handleClose();
      }
    } catch (error) {}
  };

  return (
    <>
      <SimpleBackdrop open={sending} title="Please wait..." />
      <Box
        id={'' + client._id}
        aria-controls={open ? '' + client._id : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        sx={{ width: '100%' }}
        color="secondary"
        size="small"
      >
        <Dot texte={client.currentFeedback} />
      </Box>
      <StyledMenu
        id={'' + client._id}
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <div style={{ width: '20rem', padding: '10px' }}>
          <p style={{ textAlign: 'center' }}> {client.codeclient}</p>
          <div>
            {feedback && (
              <AutoComplement value={value} setValue={setValue} options={feedback} title="Selectionnez le nouveau feedback" propr="title" />
            )}
          </div>
          <div style={{ margin: '10px 0px' }}>
            <TextField
              onChange={(e) => {
                e.preventDefault();
                setCommentaire(e.target.value);
              }}
              id="outlined-multiline-static"
              label="Commentaire"
              multiline
              rows={5}
              fullWidth
            />
          </div>
          <div>
            <Button onClick={(e) => changeFeedback(e)} color="primary" variant="contained" fullWidth>
              Valider
            </Button>
          </div>
        </div>
      </StyledMenu>
    </>
  );
}
Options.propTypes = {
  client: PropTypes.object
};
export default React.memo(Options);
