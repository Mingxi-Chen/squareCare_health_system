import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Card,Typography } from '@mui/joy';
import axios from 'axios';
import Input from '@mui/material/Input';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import IconButton from '@mui/material/IconButton';


export default function LabDisplay({patientId}) {

    const [file, setFile] = useState('');
    const [uploads, setUploads] = useState([]);  // State to store uploaded file details

    useEffect(()=>{
        fetchLabReports();
    },[]);  // Fetch on component mount 

    const fetchLabReports = async()=>{
        try{
            const response = await axios.get(`/labreports/${patientId}`)
            setUploads(response.data);
        }
        catch(error){
            console.error("Failed to fetch lab reports: ", error);
        }
    }

    const onFileChange = e => {
        setFile(e.target.files[0]);
    };

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('patientId', patientId);

        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            e.target.reset();
            setFile('');
            fetchLabReports();
            alert('File uploaded successfully');
        } catch (error) {
            alert('Error uploading file');
        }
    };

    const downloadFile = async (filename)=>{
      try {
            const response = await axios.get(`/download/${encodeURIComponent(filename)}`,{
                  responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);  // Make sure to provide the file name here
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }catch(error){
            console.error("Download error", error)
            alert('Error downloading file')
        }
    }

    const handleDelete = async(fileId) => {
        try{
            const response = await axios.delete(`/deleteReport/${fileId}`);
            alert("File deleted successfully");
            fetchLabReports();
        }
        catch(error){
            console.error("Error deleting file: ", error);
            alert("Error deleting file");
        }
    }


  return (
    <Card  
    sx={{ width: '98%' }} >
        <Typography  fontSize="xl" sx={{ mb: 0.5 }} fontWeight= "bold">
    Lab Result
  </Typography>

      
        <Grid container direction = "column" justifyContent="space-evenly"
  alignItems="center"
  sx = {{minHeight : 200 }}>
    
    
    {uploads.map((upload, index)=>{

        console.log(upload);
        return(
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
        <Typography  fontSize = "xl" sx={{mb: 0.5}} style = {{whiteSpace: "pre-wrap"}} onClick={()=> downloadFile(upload.filename)}>
            {upload.filename} - {new Date(upload.uploadDate).toLocaleDateString()}
        </Typography>
        <IconButton onClick={() => handleDelete(upload._id)} sx={{color: "red"}} edge="end" aria-label="delete" color="red">
        <DeleteIcon />
        </IconButton>
        </div>
        )
    })}
        

    
    
        <form onSubmit={onSubmit}>
            <label htmlFor="contained-button-file">
                <Input
                    accept="application/pdf" 
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={onFileChange}
                    style={{ display: 'none' }}
                />
                <Button variant="contained" component="span" >
                    Choose File
                </Button>
            </label>
            <Button type="submit" variant="contained" color="primary" style={{ marginLeft: 8 }}>
                Upload
            </Button>
        </form>

      </Grid>
      
    </Card>
  );
}