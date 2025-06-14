const { Module } = require('../models');


const createModule = async (req, res) => {
  try {
    const { name, route, icon } = req.body;

    const mod = await Module.create({ name, route, icon });
    res.status(201).json({ message: 'Módulo creado correctamente', module: mod });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear módulo', details: err.message });
  }
};

module.exports = { createModule };
