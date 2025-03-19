const express = require("express");
const router = express.Router();
const Note = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const { findByIdAndUpdate } = require("../models/User");

//route 1 : post request to add a note to database
router.post(
  "/addNotes",
  fetchuser,
  [
    body("title", "Title is empty!").notEmpty(),
    body("description", "Description is empty!!").notEmpty(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
      Note.create({
        user: req.user,
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
      });
      return res.status(200).send("Successfully notes are added!");
    } catch (err) {
      return res.status(500).send("Internal server error!");
    }
  }
);

//route 2: get request to fetch all notes of a given user
router.get("/fetchNotes", fetchuser, async (req, res) => {
  try {
    const allNotes = await Note.find({ user: req.user });
    res.json({ allNotes });
  } catch (err) {
    return res.status(500).send("Internal sever error");
  }
});

//route 3 : put a new request of updating an existing note
router.put("/updateNote/:id", fetchuser, async (req, res) => {
  try {
    const note = await Note.findOne({ user: req.user });
    if (!note) {
      return res.status(401).send("Unauthorised update");
    }
    let note2 = await Note.findById(req.params.id);
    if (!note2) {
      return res.status(400).send("Note not found");
    }

    const newNote = {};
    if (req.body.title) {
      newNote.title = req.body.title;
    }
    if (req.body.description) {
      newNote.description = req.body.description;
    }
    if (req.body.tag) {
      newNote.tag = req.body.tag;
    }
    note2 = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    return res.status(200).send("Successfully note is updated !!");
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

//route 4 : delete an existing note :
router.delete("/deleteNote/:id", fetchuser, async (req, res) => {
  try {
    const note = await Note.findOne({ user: req.user });
    //redundant
    if (!note) {
      return res.status(401).send("Unauthorized action: Access denied");
    }
    //redundant
    let note2 = await Note.findById(req.params.id);
    if (!note2) {
      return res.status(404).send("Not Found!!");
    }
    note2 = await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: "Note is deleted successfully!", note2 });
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;
