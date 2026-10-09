
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Student = require("../models/Student");

// CREATE a student
router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({
      message: "Student added successfully",
      student
    });
  } catch (error) {
    const status = error.code === 11000 ? 409 : 400;
    res.status(status).json({
      message:
        error.code === 11000
          ? "This email is already registered"
          : error.message
    });
  }
});

// READ all students, with optional search
router.get("/", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { course: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const students = await Student.find(filter).sort({
      createdAt: -1
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ one student
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a student
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        course: req.body.course
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Student updated successfully",
      student
    });
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({
      message:
        error.code === 11000
          ? "This email is already registered"
          : error.message
    });
  }
});

// DELETE a student
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
