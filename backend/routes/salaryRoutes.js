const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const Department = require('../models/Department');

// Provide formula: NetSalary = GrossSalary - TotalDeduction
// Create salary
router.post('/', async (req, res) => {
    try {
        const { employee, month, TotalDeduction } = req.body;

        // Find employee and their department to get the GrossSalary
        const empData = await Employee.findById(employee).populate('department');
        if (!empData || !empData.department) {
            return res.status(404).json({ error: 'Employee or Department not found' });
        }

        const GlossSalary = empData.department.GrossSalary;
        const NetSalary = GlossSalary - TotalDeduction;

        const newSalary = new Salary({ employee, month, GlossSalary, TotalDeduction, NetSalary });
        const savedSalary = await newSalary.save();
        res.status(201).json({ msg: 'Salary record created successfully', salary: savedSalary });
    } catch (error) {
        console.error('Error creating salary record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all salaries
router.get('/', async (req, res) => {
    try {
        const salaries = await Salary.find().populate({
            path: 'employee',
            populate: { path: 'department' }
        });
        res.status(200).json({ salaries });
    } catch (error) {
        console.error('Error fetching salaries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update salary
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { TotalDeduction } = req.body; // Normally user updates deduction or month

        const salaryData = await Salary.findById(id).populate({
            path: 'employee',
            populate: { path: 'department' }
        });

        if (!salaryData) return res.status(404).json({ error: 'Salary record not found' });

        const GlossSalary = salaryData.employee.department.GrossSalary;
        const NetSalary = GlossSalary - TotalDeduction;

        const updatedSalary = await Salary.findByIdAndUpdate(
            id,
            { TotalDeduction, NetSalary, GlossSalary },
            { new: true }
        );
        res.status(200).json({ msg: 'Salary updated successfully', salary: updatedSalary });
    } catch (error) {
        console.error('Error updating salary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete salary
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSalary = await Salary.findByIdAndDelete(id);
        if (!deletedSalary) {
            return res.status(404).json({ error: 'Salary record not found' });
        }
        res.status(200).json({ msg: 'Salary record deleted successfully' });
    } catch (error) {
        console.error('Error deleting salary record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
