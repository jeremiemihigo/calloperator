import { Fab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { IconAddressBook } from "@tabler/icons-react";
import React from "react";
import { useSelector } from "react-redux";
import PageContainer from "src/components/container/PageContainer";
import DashboardCard from "src/components/shared/DashboardCard";
import Popup from "src/static/Popup";
import FormStep from "./FormStep";

function Steps() {
  const [open, setOpen] = React.useState(false);
  const allsteps = useSelector((state) => state.steps.step);
  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 800,
      editable: false,
    },
    {
      field: "concerne",
      headerName: "Concerne",
      width: 150,
      editable: false,
    },
    {
      field: "deedline",
      headerName: "Deedline",
      width: 100,
      editable: false,
      renderCell: (p) => {
        return (
          <>
            {p.row.deedline}
            {p.row.deedline > 1 ? "Jours" : "Jour"}
          </>
        );
      },
    },
  ];
  const getId = (row) => {
    return row._id;
  };
  return (
    <>
      <PageContainer title="Steps" description="Steps B2B DRC">
        <DashboardCard
          title="Steps"
          action={
            <Fab size="small" onClick={() => setOpen(true)} color="primary">
              <IconAddressBook />
            </Fab>
          }
        >
          {allsteps && allsteps.length > 0 && (
            <DataGrid
              rows={allsteps}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              getRowId={getId}
              disableRowSelectionOnClick
            />
          )}
        </DashboardCard>
      </PageContainer>
      <Popup open={open} setOpen={setOpen} title="Add step">
        <FormStep />
      </Popup>
    </>
  );
}
export default Steps;
