import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ExcelIcon from 'assets/excelicon.jpg';
import axios from 'axios';
import Dot from 'components/@extended/Dot';
import LoaderGif from 'components/LoaderGif';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { config, lien_dt } from 'static/Lien';
import { returnFeedback } from 'utils/function';
import * as XLSX from 'xlsx';

function Affichage() {
  const location = useLocation();
  const { state } = location;
  const { customers } = state;
  const [clientaction, setClientAction] = React.useState();
  const feedback = useSelector((state) => state.feedback.feedback);

  const readCertainClient = async () => {
    try {
      const response = await axios.post(lien_dt + '/readCertainClient', { data: Object.values(customers) }, config);
      if (response.status === 200) {
        setClientAction(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    readCertainClient();
  }, [customers]);

  const [data, setData] = React.useState();

  const parametre = useSelector((state) => state.parametre.parametre);
  const willBeVisitedBy = (codeclient) => {
    if (parametre && parametre[0]?.objectif?.data.length > 0) {
      const { data } = parametre[0].objectif;
      const client = _.filter(data, { codeclient });
      if (client.length > 0) {
        return client[0].codeAgent;
      } else {
        return 'No_people';
      }
    } else {
      return 'No_people';
    }
  };

  const columns = [
    {
      field: 'codeclient',
      headerName: 'Code client',
      width: 120,
      editable: false
    },
    {
      field: 'shop',
      headerName: 'Shop',
      width: 100,
      editable: false
    },

    {
      field: 'par',
      headerName: 'PAR',
      width: 70,
      editable: false
    },

    {
      field: 'visitedBy',
      headerName: 'Visited_by',
      width: 100,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.visited_by} />;
      }
    },
    {
      field: 'last_vm',
      headerName: 'Last Feedback_VM',
      width: 280,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.last_vm} />;
      }
    },
    {
      field: 'feedback_call',
      headerName: 'Feedback_appel',
      width: 280,
      editable: false,
      renderCell: (p) => {
        return <Dot texte={p.row.feedback_call} />;
      }
    },
    {
      field: 'currentFeedback',
      headerName: 'Current status',
      width: 200,
      editable: false
    },

    {
      field: 'sla',
      headerName: 'SLA',
      width: 70,
      editable: false
    }
  ];

  const StructureDataExcel = (e) => {
    e.preventDefault();
    const fileName = returnFeedback(feedback, 'one');
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DT');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const returnLastVMFb = (visites) => {
    if (visites.length > 0) {
      return visites[visites.length - 1].demande.raison;
    } else {
      return 'no_visits';
    }
  };

  React.useEffect(() => {
    if (state && clientaction && clientaction.length > 0) {
      const datae = clientaction.map(function (x, id) {
        return {
          id,
          _id: x._id,
          //A envoyé au backend lors de changement de statut
          idFeedback: x.currentFeedback,
          codeclient: x.codeclient,
          nom: x.nomclient,
          par: x.par,
          region: x.region,
          shop: x.shop,
          currentFeedback: x.tfeedback[0]?.title,
          feedback_call: x.appel ? x.appel : 'no_calls',
          last_vm: returnLastVMFb(x.visites),
          visited_by: willBeVisitedBy(x.codeclient),
          sla: 'IN SLA'
        };
      });
      setData(datae);
    }
  }, [clientaction]);

  return (
    <>
      <Paper sx={{ padding: '10px', marginTop: '10px' }}>
        {data && (
          <div className="alloptions">
            <div className="usexlsx" onClick={(e) => StructureDataExcel(e)} style={{ marginLeft: '10px' }}>
              <div style={{ display: 'flex', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
                <img src={ExcelIcon} alt="Excel icon" width={30} height={20} style={{ marginRight: '4px' }} />
                <p style={{ padding: '0px', margin: '0px', fontSize: '12px' }}>Export in Excel</p>
              </div>
            </div>
          </div>
        )}

        {data && data.length > 0 && (
          <div>
            <DataGrid
              rows={data}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 50
                  }
                }
              }}
              pageSizeOptions={[50]}
              disableRowSelectionOnClick
            />
          </div>
        )}
        {!data && <LoaderGif width={400} height={400} />}
      </Paper>
    </>
  );
}

export default Affichage;
