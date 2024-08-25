import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import Popup from 'static/Popup';
import { Typography } from '../../../node_modules/@mui/material/index';
import ItemPlain from './AddItemPlainte';
import AddPlainte from './AddPlainte';

function Plainte() {
  const [open, setOpen] = React.useState(false);
  const [openItem, setOpenItem] = React.useState(false);
  const plainte = useSelector((state) => state.plainte.plainte);
  const [plainteSelect, setPlainteSelect] = React.useState('');

  const addItem = (params) => {
    setPlainteSelect(params);
    setOpenItem(true);
  };

  return (
    <div>
      <Typography sx={{ cursor: 'pointer', color: 'blue' }} onClick={() => setOpen(true)} noWrap>
        Add Complaint
      </Typography>

      <div>
        <table>
          <thead>
            <tr>
              <td>#</td>
              <td>Title</td>
              <td>Property</td>
              <td>Items</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {plainte &&
              plainte.map((index) => {
                return (
                  <tr key={index._id}>
                    <td>{index.id}</td>
                    <td>{index.title}</td>
                    <td>{index.property}</td>
                    <td>
                      <ol>
                        {index.alltype.map((item, cle) => {
                          return (
                            <li key={cle}>
                              {item.title}
                              {item.ticket && <span style={{ color: 'blue' }}>{' (ticket)'}</span>}
                            </li>
                          );
                        })}
                      </ol>
                    </td>
                    <td>
                      <Fab size="small" color="primary" onClick={() => addItem(index)}>
                        <Add fontSize="small" />
                      </Fab>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Popup open={open} setOpen={setOpen} title="Plainte">
        <AddPlainte />
      </Popup>
      <Popup open={openItem} setOpen={setOpenItem} title="Add Items">
        <ItemPlain plait_select={plainteSelect} />
      </Popup>
    </div>
  );
}

export default React.memo(Plainte);
