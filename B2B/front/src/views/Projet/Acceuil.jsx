import { Box, Grid2 as Grid } from "@mui/material";
import React from "react";
import PageContainer from "src/components/container/PageContainer";
import Categorisation from "src/views/Projet/Categorie";

// components
import ListeProjet from "./ListeProjet";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, lg: 2 }}>
            <Categorisation />
          </Grid>
          <Grid item size={{ xs: 12, lg: 10 }}>
            <ListeProjet />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
