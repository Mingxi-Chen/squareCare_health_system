import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Card,Typography } from '@mui/joy';
import axios from 'axios';
import {useEffect, useState} from 'react';

export default function Profile({patientId}) {
      // console.log({patientId})
      const [patient,setPatient] = useState({});

      useEffect(()=>{
            axios.get(`/patientsManager/${patientId}`)
            .then(response => {
                  console.log(response.data)
                  if(response.data.success)
                  {
                        setPatient(response.data.patient);
                        
                  }
            })
            .catch(error =>
                  console.error("Failed to fetch patient: ", error)
            )
      },[patientId]);

  return (
    <Card  
    sx={{ width: '98%' }} >
        <Grid container direction = "column" justifyContent="space-evenly"
  alignItems="flex-start">
    <Typography  fontSize="xl" sx={{ mb: 0.5 }} fontWeight= "bold">
    Profile
  </Typography>
    <Grid container direction="row" justifyContent="space-evenly">
    <Grid >
          <Typography  fontSize="xl" textAlign='left'>
    Name : {patient.firstName} {patient.lastName} 
  </Typography>
        </Grid>
        <Grid >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }} align='right'>
    Temperature
  </Typography>
        </Grid>
        <Grid >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }}>
    Blood Pressure 
  </Typography>
        </Grid>
        <Grid >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }}>
    Pulse Rate
  </Typography>
        </Grid>
        </Grid>

        <Grid container direction="row" justifyContent="space-evenly">
    <Grid >
          <Typography  fontSize="xl" textAlign='left'>
    Gender : {patient.gender} 
  </Typography>
        </Grid>
        <Grid >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }} color="success" fontFamily="monospace"  level="title-lg">
        {patient.temperature}° F
  </Typography>
        </Grid>
        <Grid >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }} color="success" fontFamily="monospace"  level="title-lg">
        {patient.bloodPressure} 
  </Typography>
        </Grid>
        <Grid >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }} color="success" fontFamily="monospace"  level="title-lg">
        {patient.pulse} 
  </Typography>
        </Grid>
        </Grid>
        <Grid container direction="row" justifyContent="space-evenly">
    <Grid >
          <Typography  fontSize="xl" textAlign='left'>
    Phone : {patient.phone}  
  </Typography>
        </Grid>
        <Grid >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }}>
        Address : {patient.address}
  </Typography>
        </Grid>
        <Grid >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }}>
    Doctor : {patient.assignedDoctor} 
  </Typography>
        </Grid>
        <Grid >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }}>
     Status : {patient.status}  
  </Typography>
        </Grid>
        </Grid>

      </Grid>

    </Card>
  );
}
