const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    DepartementCode: { type: String, required: true, unique: true },
    DepartementName: { type: String, required: true },
    GrossSalary: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
