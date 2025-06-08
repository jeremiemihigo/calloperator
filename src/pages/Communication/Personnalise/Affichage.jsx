import { Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { CreateContextePerformance } from "./Context";

function Affichage() {
  const { dataexcel, setDataExcel } = React.useContext(
    CreateContextePerformance
  );
  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 40,
      pinned: "left",
    },
    {
      field: "codeAgent",
      headerName: "Code agent",
      width: 120,
      pinned: "left",
    },
    {
      field: "name",
      headerName: "Name",
      width: 250,
      editable: false,
    },
    {
      field: "shop",
      headerName: "Shop",
      width: 100,
      editable: false,
    },
    {
      field: "region",
      headerName: "Region",
      width: 100,
      editable: false,
    },
    {
      field: "option",
      headerName: "Option",
      width: 50,
      editable: false,
      renderCell: (p) => {
        return (
          <>
            <Delete
              onClick={() =>
                setDataExcel(dataexcel.filter((x) => x.id !== p.row.id))
              }
              sx={{ cursor: "pointer" }}
              fontSize="small"
            />
          </>
        );
      },
    },
  ];

  function getRowId(row) {
    return row.codeAgent;
  }

  return (
    <>
      {dataexcel && dataexcel.length > 0 && (
        <div>
          <DataGrid
            rows={dataexcel}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 50,
                },
              },
            }}
            getRowId={getRowId}
            pageSizeOptions={[50]}
            disableRowSelectionOnClick
          />
        </div>
      )}
      {/* <div className="affichage__">
        {result &&
          result.length > 0 &&
          result.map((index) => {
            return (
              <Paper
                className={index._id === concerne?._id ? 'select' : 'notselect'}
                sx={{ marginTop: '10px', padding: '10px' }}
                onDoubleClick={() => setConcerne(index)}
                key={index._id}
                elevation={2}
              >
                <div className="avatar_sender">
                  <Avatar src="/profile.png" alt={index.sender} />
                  <div>
                    <p className="sender">{index.sender}</p>
                    <p className="time">{moment(index?.createdAt).fromNow()}</p>
                  </div>
                </div>
                <p className="message__">{index.message}</p>
                {FileViewer(index.filename)}
              </Paper>
            );
          })}
      </div> */}
    </>
  );
}

export default Affichage;
