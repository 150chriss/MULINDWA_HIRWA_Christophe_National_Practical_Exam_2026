const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    GlossSalary: { type: Number, required: true },
    TotalDeduction: { type: Number, required: true },
    NetSalary: { type: Number, required: true },
    month: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);
