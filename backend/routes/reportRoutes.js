const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');

// Generate monthly Employee payroll
router.get('/payroll/:month', async (req, res) => {
    try {
        const { month } = req.params;
        const salaries = await Salary.find({ month }).populate({
            path: 'employee',
            populate: { path: 'department' }
        });

        const reportData = salaries.map(sal => {
            return {
                FirstName: sal.employee.FirstName,
                LastName: sal.employee.LastName,
                Position: sal.employee.Position,
                Departement: sal.employee.department.DepartementName,
                NetSalary: sal.NetSalary
            };
        });

        res.status(200).json({ report: reportData });
    } catch (error) {
        console.error('Error generating payroll report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
