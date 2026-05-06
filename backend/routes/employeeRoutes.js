const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Create a new employee
router.post('/', async (req, res) => {
    try {
        const { employeeNumber, FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, department } = req.body;
        const newEmployee = new Employee({ employeeNumber, FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, department });
        const savedEmployee = await newEmployee.save();
        res.status(201).json({ msg: 'Employee created successfully', employee: savedEmployee });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Employee number already exists' });
        }
        console.error('Error creating employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().populate('department');
        res.status(200).json({ employees });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
