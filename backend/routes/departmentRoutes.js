const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// Create a new department
router.post('/', async (req, res) => {
    try {
        const { DepartementCode, DepartementName, GrossSalary } = req.body;
        const newDept = new Department({ DepartementCode, DepartementName, GrossSalary });
        const savedDept = await newDept.save();
        res.status(201).json({ msg: 'Department created successfully', department: savedDept });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Department code already exists' });
        }
        console.error('Error creating department:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({ departments });
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
