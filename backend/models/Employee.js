const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeNumber: { type: String, required: true, unique: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Position: { type: String, required: true },
    Address: { type: String, required: true },
    Telephone: { type: String, required: true },
    Gender: { type: String, required: true },
    hiredDate: { type: Date, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
