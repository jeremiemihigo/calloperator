import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import _ from "lodash";
import React from "react";

function TabAgent({ data }) {
  const [tableau, setTableau] = React.useState();
  React.useEffect(() => {
    if (data) {
      let agent = _.groupBy(data, "agent");
      let table = Object.keys(agent).map((index, key) => {
        return {
          id: key + 1,
          agent: index,
          frequence: agent[index].length,
          pourcentage: ((agent[index].length * 100) / data.length).toFixed(0),
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
      field: "agent",
      headerName: "Agent",
      width: 200,
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

export default TabAgent;
