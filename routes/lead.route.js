const express = require("express");
const { LeadModel, LeadSchema } = require("../models/lead.model");
const { auth } = require("../middleware/auth.middleware");
const leadRouter = express.Router();

// creating a route for adding the lead
leadRouter.post("/create", auth, async (req, res) => {
  const payload = req.body;
  try {
    const lead = new LeadModel(payload);
    await lead.save();
    res.status(201).send({ msg: "A new Lead is created", lead });
  } catch (error) {
    res.send({ msg: error });
  }
});

// Get all the leads

leadRouter.get("/all", async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    const leads = await LeadModel.find({}).skip(skip).limit(limit);

    const totalLeads = await LeadModel.countDocuments();
    const totalPages = Math.ceil(totalLeads / limit);

    res.send({
      leads,
      currentPage: page,
      totalPages,
      totalLeads,
    });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

// For seaching the data

leadRouter.post(`/search`, async (req, res) => {
  console.log(req.query);
  try {
    const filter = {};
    const schemaFields = Object.keys(LeadSchema0.paths);

    schemaFields.forEach((field) => {
      if (req.query[field]) {
        filter[field] = new RegExp(req.query[field], "i");
      }
    });
    const leads = await LeadModel.find(filter);
    res.status(200).send(leads);
  } catch (error) {
    res.status(400).send({ msg: error });
  }
});

// for sorting the data

leadRouter.get("/sort", async (req, res) => {
  try {
    const { sortBy, order = "asc" } = req.query;
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "asc" ? 1 : -1;
    }
    const leads = await LeadModel.find().sort(sortOptions);
    res.send(leads);
  } catch (error) {
    res.status(500).send(error);
  }
});

//for updating the data

leadRouter.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log(id);
    const lead = await LeadModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      return res.status(404).send({ message: "Lead not found" });
    }

    res.status(200).send(lead);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// for deleting the data

leadRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LeadModel.findByIdAndDelete(id);
    res.status(200).send({ message: result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { leadRouter };
