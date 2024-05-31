import * as React from 'react';
import { Card,Typography } from '@mui/joy';
import { useState,useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import AddMedicine from './AddMedicine';
import EditMedicine from './EditMedicine';

export default function MedDisplay({patientId}) {
      const [meds, setMeds] = useState([]);
      const [openDialog, setOpenDialog] = useState(false);
      const [openEditDialog, setOpenEditDialog] = useState(false);
      const [currentMed, setCurrentMed] = useState(null);

        useEffect(()=>{
            fetchData();
        },[]);  // Fetch on component mount 

        const fetchData = async () => {
            try {
                const response = await axios.get(`/medicine/${patientId}`);
                setMeds(response.data);
            } catch (error) {
                console.error("Failed to fetch medications: ", error);
            }
        };

        const handleAddNew = () => {
            setOpenDialog(true);
        }

        const handleSave = async (newMed)=> {
            try{
                  //Include patientId to send data to server
                  const completeMedData = {...newMed, patientId};
                  await axios.post('/medicine',completeMedData);
                  fetchData();
            }
            catch(error){
                  console.error("Failed to add medication: ", error);
            }
        }
    
        const handleDelete =async (id) => {
            
            await axios.delete(`/medicine/${id}`)
            fetchData();
        };
    
        const handleEdit = (med) => {
            if(med){

                  setCurrentMed(med);
                  console.log(currentMed)
                  setOpenEditDialog(true);
            }
        };

        const handleUpdate = async (updateMed) =>{
            try{
                  await axios.put(`/medicine/${updateMed._id}`,updateMed)
                  fetchData();
            }
            catch(error){
                  console.error("Failed to update medicine: ", error);
            }
        }

  return (
    <Card  
    sx={{ width: '98%' }} >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }} fontWeight= "bold">
    Medicine
  </Typography>
  <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Dosage</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {meds.map((med) => (
                        <TableRow key={med._id}>
                            <TableCell>{med.name}</TableCell>
                            <TableCell>{med.dosage}</TableCell>
                            <TableCell>{med.duration}</TableCell>
                            <TableCell>{new Date(med.date).toLocaleDateString()}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => handleEdit(med)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(med._id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button startIcon={<AddIcon />} onClick={handleAddNew} sx={{ mt: 2, ml: 2 }}>
                Add New Medication
            </Button>
            <AddMedicine open={openDialog} onClose={()=>setOpenDialog(false)} onSave={handleSave} />
            <EditMedicine open={openEditDialog} onClose={()=> setOpenEditDialog(false)} onSave={handleUpdate} existingData={currentMed} />
        </TableContainer>

    </Card>
  );
}