const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Create an Employee
router.post('/', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update an Employee
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete an Employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err });
  }
});
router.get('/search', async (req, res) => {
  try {
    const { department, position, name } = req.query;
    const query = {};

    if (department) query.department = department;
    if (position) query.position = position;
    if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive name search

    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, department, position } = req.body;
    const newEmployee = new Employee({ firstName, lastName, email, department, position });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (err) {
    res.status(500).json({ message: 'Error creating employee', error: err.message });
  }
});
