import BuildIcon from '@mui/icons-material/Build';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DetailsIcon from '@mui/icons-material/Details';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useSelector } from 'react-redux';

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

export default function Options({ client, validation, openChat, apresAssistance, openForm, fermeture }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const user = useSelector((state) => state.user?.user);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id={'' + client._id}
        aria-controls={open ? '' + client._id : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Options
      </Button>
      <StyledMenu
        id={'' + client._id}
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <div>
          {['Open_technician_visit', 'not_resolved'].includes(client.statut) && (
            <>
              <MenuItem
                onClick={(e) => {
                  openForm(e, client);
                  handleClose();
                }}
                disableRipple
              >
                <BuildIcon />
                Assign a technician
              </MenuItem>
              <MenuItem
                onClick={() => {
                  apresAssistance(client);
                  handleClose();
                }}
                disableRipple
              >
                <CallMadeIcon />
                Send to call center
              </MenuItem>
            </>
          )}
          {client.statut !== 'Complaint to close' && client.open && (
            <MenuItem
              onClick={() => {
                fermeture(client.idPlainte);
                handleClose();
              }}
              disableRipple
            >
              <CloseIcon />
              Request for closure
            </MenuItem>
          )}

          {client.statut === 'resolved_awaiting_confirmation' &&
            ((user?.synchro_shop && user?.synchro_shop.length > 0) || user.fonction === 'superUser') && (
              <MenuItem
                onClick={() => {
                  validation(client);
                  handleClose();
                }}
                disableRipple
              >
                <CheckIcon />
                Check the action
              </MenuItem>
            )}
          <MenuItem
            onClick={(e) => {
              openChat(client, e);
              handleClose();
            }}
            disableRipple
          >
            <DetailsIcon />
            Detail
          </MenuItem>
        </div>
      </StyledMenu>
    </div>
  );
}
Options.propTypes = {
  client: PropTypes.object,
  validation: PropTypes.func,
  apresAssistance: PropTypes.func,
  openForm: PropTypes.func,
  fermeture: PropTypes.func,
  openChat: PropTypes.func
};
