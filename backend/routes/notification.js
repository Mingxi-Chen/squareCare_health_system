const router = require("express").Router();
const Notification = require("../models/Notification")

router.get('/:userId', async (req,res) => {
    try{
        const notification = await Notification.find({sentTo: req.params.userId})
            .populate('sentTo', 'name')
            .exec();
        res.status(200).json(notification);
    }
    catch(error){
        res.status(500).send(error.message);
    }
})

//Delete a notification
router.delete('/:id', async(req,res)=>{
    try{
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete successfully")
    }
    catch(error)
    {
        res.status(500).json(error.message);
    }
})

//Delete all notification 
router.delete('/deleteAll/:userId', async (req, res) => {
    try {
        // The deleteMany method deletes all documents that match the filter
        await Notification.deleteMany({ sentTo: req.params.userId });
        res.status(200).json("All notifications deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
});

module.exports = router