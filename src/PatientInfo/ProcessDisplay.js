import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Card,Link,Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';

export default function ProcessDisplay({patientId}) {

  const navigate = useNavigate()

  const toProcess = () => {
    let path = `/process/${patientId}`;
    navigate(path)
  }
  console.log("From ProcessDisplay.js: ",patientId)

  return (
    <Card  
    sx={{ width: '98%' }} >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }} fontWeight= "bold">
          Treatment Process
        </Typography>
        <Grid container direction = "column" justifyContent="space-evenly"
          alignItems="center"
          sx = {{minHeight : 300 }}
        >
    
    <Grid >
          <Typography  fontSize="xl" textAlign='left'  style={{ whiteSpace: "pre-wrap" }}
          component={Link}
          onClick = {toProcess}
          >
          View Detailed Treatment Process for the Patient</Typography>
      </Grid>
        
    

      </Grid>

    </Card>
  );
}