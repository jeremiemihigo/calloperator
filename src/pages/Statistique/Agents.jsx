/* eslint-disable react/prop-types */
import React from 'react';
import { Fab, Tooltip, Paper } from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import _ from 'lodash';
import Popup from 'static/Popup';
import AfficheInfo from './AfficheInfo';
import { Input } from 'antd';
import { DataGrid } from '@mui/x-data-grid';

function Agents({ listeDemande }) {
  const [donnee, setDonnees] = React.useState();

  const [show, setShow] = React.useState(false);
  const [dataToShow, setDataToShow] = React.useState();
  const sendDetails = (e, code) => {
    e.preventDefault();
    setDataToShow(_.filter(listeDemande, { codeAgent: code }));
    setShow(true);
  };
  const analyse = () => {
    const donne = _.groupBy(listeDemande, 'codeAgent');
    try {
      let table = [];
      let donnerKey = Object.keys(donne);
      for (let i = 0; i < donnerKey.length; i++) {
        table.push({
          nom: listeDemande.filter((x) => x.agent.codeAgent === donnerKey[i])[0].agent.nom,
          code: donnerKey[i],
          nonRepondu: listeDemande.filter((x) => x.agent.codeAgent === donnerKey[i] && x.reponse.length === 0).length,
          repondu: listeDemande.filter((x) => x.agent.codeAgent === donnerKey[i] && x.reponse.length > 0).length,
          total: listeDemande.filter((x) => x.agent.codeAgent === donnerKey[i]).length,
          id: i
        });
      }
      setDonnees(_.orderBy(table, 'total', 'desc'));
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    analyse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listeDemande]);
  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    }
  });
  const handleChanges = (e) => {
    let target = e.target.value.toUpperCase();

    setFilterFn({
      fn: (items) => {
        if (target === '') {
          return items;
        } else {
          return items.filter((x) => x.code.includes(target) || x.nom.includes(target));
        }
      }
    });
  };
  const columns = [
    {
      field: 'nom',
      headerName: 'Nom Agent',
      width: 250,
      editable: false
    },

    {
      field: 'code',
      headerName: 'Code Agent',
      width: 100,
      editable: false
    },
    {
      field: 'repondu',
      headerName: 'Conformes',
      width: 80,
      editable: false
    },
    {
      field: 'nonRepondu',
      headerName: 'Attentes',
      width: 70,
      editable: false
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 70,
      editable: false
    },

    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Plus les détails" onClick={(e) => sendDetails(e, params.row.code)}>
              <Fab size="small" color="primary">
                <MedicalInformationIcon fontSize="small" />
              </Fab>
            </Tooltip>
          </>
        );
      }
    }
  ];
  return (
    <Paper elevation={3} sx={{ padding: '10px' }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '30%' }}>
          <Input onChange={(e) => handleChanges(e)} placeholder="Cherchez le Code agent ou nom Agent" />
        </div>
      </div>
      {donnee && (
        <DataGrid
          rows={filterFn.fn(donnee)}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 7
              }
            }
          }}
          pageSizeOptions={[7]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      )}

      {dataToShow && (
        <Popup open={show} setOpen={setShow} title={`pour ${dataToShow[0].agent.nom} -------- code : ${dataToShow[0].agent.codeAgent}`}>
          <AfficheInfo data={dataToShow} />
        </Popup>
      )}
    </Paper>
  );
}

export default Agents;
