import { Card, Typography} from "@mui/joy";
import {Stack,Button} from '@mui/material'
import { Delete,Edit } from "@mui/icons-material";
import Pre from "./Pre";
import Post from "./Post";
import Surgery from "./Surgery";
import { useNavigate, useParams } from "react-router-dom";
function Process() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const PatientDetail = () =>{
    let path = `/patientInfo/${patientId}`;
    navigate(path);
  }

  return (
    <div className="Process">
    <Card
    sx={{
        
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
        "--Card-padding" : "20px"
      }}>
      <Typography level="h1" className="MuiTypography-root MuiTypography-inherit" 
      
      >Assign Treatment Process
      </Typography>
      <Pre patientId={patientId} />
        <Surgery patientId={patientId} />
        <Post patientId={patientId} />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="contained" startIcon={<Delete />}color = "error" onClick = {PatientDetail}>
        Delete
      </Button>
      <Button variant="contained" endIcon={<Edit/>} onClick = {PatientDetail}>
        Save
      </Button>
    </Stack>
      </Card>
    </div>
  );
}

export default Process;