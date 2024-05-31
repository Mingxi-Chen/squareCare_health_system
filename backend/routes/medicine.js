const router = require("express").Router();
const Medicine = require("../models/Medicine")

//Fetch medications for a specific patient
router.get('/:patientId', async (req,res)=> {
    try{
        const medicine = await Medicine.find({patientId: req.params.patientId})
        res.status(200).json(medicine);
    }
    catch(error)
    {
        res.status(500).send(error.message)
    }
})

//Add a new medicine
router.post('/', async(req,res)=>{
    try{
        const newMed = new Medicine(req.body);
        await newMed.save();
        res.status(201).json(newMed);
    }
    catch(error)
    {
        res.status(400).json(error.message)
    }
})

//Update an existing medicine
router.put('/:id', async(req,res)=>{
    try{
        const updateMed = await Medicine.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(200).json(updateMed);
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
})


//Delete a medicine
router.delete('/:id', async(req,res)=>{
    try{
        await Medicine.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete successfully")
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
})

module.exports = router;