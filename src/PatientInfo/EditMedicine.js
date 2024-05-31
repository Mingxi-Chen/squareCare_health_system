import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
function EditMedicine({ open, onClose, onSave, existingData }) {
    const [medData, setMedData] = useState({
        name: "",
        dosage:"",
        duration:"",
        data:""
    });
    dayjs.extend(utc);
    useEffect(() => {

        if(existingData){

            setMedData({
                ...existingData,
                date:formatDate(existingData.date)
            });  // Update state when existingData changes
        }

    }, [existingData]);

    const handleChange = (event) => {
        setMedData({ ...medData, [event.target.name]: event.target.value });
    };

    const handleSubmit = () => {
        onSave({
            ...medData,
            date: dayjs(medData.date).utc().toISOString()
        });
        onClose();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
    
        return dayjs(dateString).utc().format('YYYY-MM-DD');
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Medication</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Medication Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={medData.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="dosage"
                    label="Dosage"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={medData.dosage}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="duration"
                    label="Duration"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={medData.duration}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="date"
                    label="Date"
                    type="date"
                    fullWidth
                    variant="standard"
                    value={medData.date}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditMedicine;
