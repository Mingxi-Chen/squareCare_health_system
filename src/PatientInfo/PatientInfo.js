import { Card, Typography} from "@mui/joy";
import {Stack,Button} from '@mui/material'
import { Cancel, Delete,Done,Edit, RampRight } from "@mui/icons-material";
import Profile from "./Profile";
import LabDisplay from "./LabDisplay";
import MedDisplay from "./MedDisplay";
import ProcessDisplay from "./ProcessDisplay";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {Box} from '@mui/material'

function PatientInfo() {

  const {patientId} = useParams();
  console.log("From PatientInfo.js, Patient id is ",{patientId})

  const navigate = useNavigate();
  const PatientPage = () =>{
    let path = `/patients`;
    navigate(path);
  }

  return (
    <div className="PatientInfo">
    <Card
    sx={{
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
        "--Card-padding" : "20px"
      }}>
    
      <Typography level="h1" className="MuiTypography-root MuiTypography-inherit" 
      
      >Patient Details</Typography>
      <Profile patientId = {patientId}/>
   
      <MedDisplay patientId = {patientId}/>
      <ProcessDisplay patientId = {patientId}/>

      {/* <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="contained" startIcon={<Delete />}color = "error">
        Delete
      </Button>
      <Button variant="contained" endIcon={<Edit/>}>
        Save
      </Button>
    </Stack> */}
      </Card>
      <Box 
        display="flex" 
        justifyContent="flex-end" // Aligns the button to the right
        marginTop={2}
      >
        <Button 
          variant="contained" 
          startIcon={<Done />} 
          color="primary" 
          onClick={PatientPage}
          sx={{ padding: '10px 20px' }} // Provides extra padding around the button text and icon
        >
          Done
        </Button>
      </Box>
    </div>
  );
}

export default PatientInfo;
