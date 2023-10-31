const express = require('express');
const router = express.Router();
const getUserData = require('../Middleware/getUserData')
const {body, validationResult} = require('express-validator')
const Notes = require('../Database/Models/Notes')


// Requires Auth :::: To fetch all the notes from the Database
router.get('/allnotes',getUserData , async (req, res)=>{
    const notes = await Notes.find({user: req.user.id});
    res.json(notes);
})


// Requires Auth :::: To post notes in the Database
router.post('/createnote', getUserData, async(req, res) =>{
    const error = validationResult(req);
    
try{
    const note = await Notes.create({
        user: req.user.id,
        title:req.body.title,
        desc:req.body.desc
    });

    await note.save();
    res.json(note);
    }catch(err){
        console.log('Facing Issues in saving notes');
    }
})


// Requires Authentication :::: Updating the Notes
router.put('/updatenote/:id', getUserData, [
    body('title', 'Enter a Valid Title').isLength({min:2}),
    body('desc', 'Enter a Valid Description').isLength({min:2}),
], async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array() });
    }
    console.log('Reached here')
    const {title, desc} = req.body

    const newNote = {}
    if(title){ newNote.title = title}
    if(desc){ newNote.desc = desc}

    const objId = req.params.id
    const userId = req.user.id
    const note = await Notes.findOne({_id:objId})
    if(!note)
        return res.status(400).json({error: 'Note not Found'});

    if(note.user.toString() !== userId)
        return res.status.json({error: 'Unauthorized Access'});

    try{
    const response = await Notes.findOneAndUpdate({_id:objId}, { $set:{title: newNote.title, desc: newNote.desc}},{returnNewDocument: true});

    res.json(response);

    }catch(err){
        console.log('Facing Issues')
    }
})

// Requires Auth :::: Deleting an existing note from the database
router.delete('/deletenote/:id', getUserData, async(req, res) => {
    const note = await Notes.findOne({_id: req.params.id});
    if(!note)
        return res.status(400).json({error: 'Note not found'});

    if(req.user.id.toString() !== note.user.toString())
        return res.status(401).json({error:'Unauthorized Access'});

    try{
    const response = await Notes.findByIdAndDelete({_id:req.params.id});
    res.json(response);

    }catch(err){
        console.log('Facing Issues')
    }
})


module.exports = router;