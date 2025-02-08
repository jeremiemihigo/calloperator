import { Button, TextField } from '@mui/material';
import SimpleBackdrop from 'Control/Backdrop';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditRole, Postrole } from 'Redux/role';
import Selected from 'static/Select';

function Formulaire({ data }) {
  const [role, setRole] = React.useState('');
  const [valueFilter, setDataFilter] = React.useState('');
  const edit = useSelector((state) => state.role);
  const [typeSelect, setType] = React.useState('');
  const dispatch = useDispatch();
  const sendData = async () => {
    try {
      const donner = {
        title: role,
        filterBy: valueFilter,
        type: typeSelect
      };
      dispatch(Postrole(donner));
    } catch (error) {
      console.log(error);
    }
  };
  const dataFilter = [
    { id: 1, title: 'Region', value: 'region' },
    { id: 2, title: 'Shop', value: 'shop' },
    { id: 3, title: 'Feedback en cours', value: 'currentFeedback' },
    { id: 4, title: 'Overall', value: 'all' }
  ];
  const type = [
    { id: 1, title: 'Suivi', value: 'suivi' },
    { id: 2, title: 'Operation', value: 'operation' }
  ];
  React.useEffect(() => {
    if (data) {
      setRole(data?.title);
      setDataFilter(data?.filterBy);
      setType(data?.type);
    }
  }, [data]);
  const sendEdit = () => {
    let donner = {
      id: data._id,
      data: {
        title: role,
        filterBy: valueFilter,
        type: typeSelect
      }
    };
    dispatch(EditRole(donner));
  };
  return (
    <div style={{ width: '20rem', padding: '10px' }}>
      {(edit.edit === 'pending' || edit.postrole === 'pending') && <SimpleBackdrop open={true} title="Please wait..." />}
      <div>
        <TextField value={role} onChange={(e) => setRole(e.target.value)} fullWidth label="Role" id="role" />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <Selected label="filter by << default tracker >>" data={dataFilter} value={valueFilter} setValue={setDataFilter} />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <Selected label="Type" data={type} value={typeSelect} setValue={setType} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <Button
          disabled={edit.edit === 'pending' || edit.postrole === 'pending'}
          onClick={data ? () => sendEdit() : (e) => sendData(e)}
          fullWidth
          color={data ? 'secondary' : 'primary'}
          variant="contained"
        >
          {data ? 'Edit' : 'Valider'}
        </Button>
      </div>
    </div>
  );
}

export default Formulaire;
