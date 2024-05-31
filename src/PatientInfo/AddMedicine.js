import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
function AddMedicine({ open, onClose, onSave }) {
    const initialFormState = {
        name: '',
        dosage: '',
        duration: '',
        date: ''
    };
    const [newMed, setNewMed] = useState(initialFormState);

    dayjs.extend(utc);

    const handleChange = (event) => {
        setNewMed({ ...newMed, [event.target.name]: event.target.value });
    };

    const handleSubmit = () => {
        onSave({
            ...newMed,
            date: dayjs(newMed.date).utc().toISOString()
        });
        setNewMed(initialFormState);  // Reset form after submitting
        onClose();  // Close dialog after saving
    };

    const handleClose = () => {
        setNewMed(initialFormState);  // Reset form when closing without submitting
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Medication</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Medication Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newMed.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="dosage"
                    label="Dosage"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newMed.dosage}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="duration"
                    label="Duration"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newMed.duration}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="date"
                    label="Date"
                    type="date"
                    fullWidth
                    variant="standard"
                    value={newMed.date}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddMedicine;
