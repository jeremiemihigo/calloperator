import { Box, Grid2 as Grid } from "@mui/material";
import React from "react";
import PageContainer from "src/components/container/PageContainer";

// components
import ListeProjet from "./ListeProjet";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, lg: 12 }}>
            <ListeProjet />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
