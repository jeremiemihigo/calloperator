import { Button, TextField, Typography } from '@mui/material';
import AutoComplement from 'components/AutoComplete';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Editfeedback, Postfeedback } from 'Redux/feedback';
import { returnRole } from 'utils/function';

function Formulaire({ data }) {
  console.log(data);
  const role = useSelector((state) => state.role.role);
  const [initiale, setInitiale] = React.useState({ title: '', delai: '' });
  const { title, delai } = initiale;
  const [value, setValue] = React.useState('');
  const [allroles, setAllroles] = React.useState([]);
  const dispatch = useDispatch();

  const sendData = async (e) => {
    let temps = delai !== '' && !isNaN(parseInt(delai)) ? delai : 1;
    e.preventDefault();
    try {
      dispatch(
        Postfeedback({
          title,
          delai: parseInt(temps) * 1440,
          idRole: allroles
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  const sendEdit = async (e) => {
    e.preventDefault();
    try {
      const donner = {
        id: data.id,
        data: { title, delai, idRole: allroles }
      };
      dispatch(Editfeedback(donner));
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (data) {
      setInitiale({
        title: data?.statut,
        delai: data?.delai
      });
      setAllroles(data.idRole);
    }
  }, [data]);

  React.useEffect(() => {
    if (value) {
      if (!allroles.includes(value.idRole)) {
        setAllroles([...allroles, value.idRole]);
      }
    }
  }, [value]);

  return (
    <div style={{ width: '20rem', padding: '10px' }}>
      <div>
        <TextField
          value={title}
          onChange={(e) =>
            setInitiale({
              ...initiale,
              title: e.target.value
            })
          }
          fullWidth
          label="Feedback"
          id="Feedback"
        />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField
          value={delai}
          onChange={(e) =>
            setInitiale({
              ...initiale,
              delai: e.target.value
            })
          }
          fullWidth
          label="Delai"
          id="delai"
        />
      </div>
      {role && (
        <div>
          <AutoComplement
            value={value}
            setValue={setValue}
            options={role.filter((x) => x.type === 'operation')}
            title="Role"
            propr="title"
          />
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <Button onClick={data ? (e) => sendEdit(e) : (e) => sendData(e)} fullWidth color="primary" variant="contained">
          {data ? 'Edit' : 'Valider'}
        </Button>
      </div>
      {allroles && allroles.length > 0 && (
        <div>
          {allroles.map((index, key) => {
            return (
              <p key={key} style={{ padding: '0px', margin: '10px 0px' }}>
                {returnRole(role, index)}{' '}
                <Typography
                  onClick={(e) => {
                    e.preventDefault();
                    setAllroles(allroles.filter((x) => x !== index));
                  }}
                  sx={{ color: 'red', cursor: 'pointer' }}
                  component="span"
                >
                  Delete
                </Typography>
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Formulaire;
