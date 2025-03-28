import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import _ from "lodash";
import React from "react";

function Static_Feedback({ data }) {
  const [tableau, setTableau] = React.useState();
  let question =
    "Si tout va bien chez vous, Monsieur / Madame, nous aurons besoin de savoir la raison du non-paiement de votre Kit solaire BBOXX.";

  React.useEffect(() => {
    if (data) {
      let feedback = _.groupBy(data, question);
      let table = Object.keys(feedback).map((index, key) => {
        return {
          id: key + 1,
          feedback: index,
          frequence: feedback[index].length,
          pourcentage: ((feedback[index].length * 100) / data.length).toFixed(
            0
          ),
        };
      });
      setTableau(
        table.sort(function (x, y) {
          return y.pourcentage - x.pourcentage;
        })
      );
    }
  }, [data]);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      editable: false,
    },

    {
      field: "feedback",
      headerName: "Feedback",
      width: 330,
      editable: false,
    },
    {
      field: "frequence",
      headerName: "Frequence",
      width: 100,
      editable: false,
    },
    {
      field: "pourcentage",
      headerName: "Pourcentage",
      width: 100,
      editable: false,
      renderCell: (params) => {
        return params.row.pourcentage;
      },
    },
  ];

  return (
    <Paper>
      {tableau && (
        <DataGrid
          rows={tableau}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 6,
              },
            },
          }}
          pageSizeOptions={[6]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      )}
    </Paper>
  );
}

export default Static_Feedback;
