const Statesfunfact = require('../model/StatesFunFact');
const State = require('../model/State');

// Create a new fun fact for a state
const createNewFunFact = async (req, res) => {
    // Check if the request body contains fun facts
    if (!req.body?.funfacts) return res.status(400).json({ message: 'State fun facts value required' });

    // Ensure that the fun facts value is an array
    if (!Array.isArray(req.body.funfacts)) return res.status(400).json({ message: "State fun facts value must be an array" });

    // Find the state based on the provided code
    const state = await State.findOne({ code: req.params.code.toUpperCase() }).exec();
    if (!state) return res.status(400).json({ message: "Invalid state abbreviation parameter" });

    // Check if there are existing fun facts for the state
    const existingFunState = await StatesFunFact.findOne({ code: state.code }).exec();
    if (existingFunState) {
        // If fun facts exist, append the new fun facts to the existing ones
        req.body.funfacts.forEach(funFact => existingFunState.funfacts.push(funFact));
        const result = await existingFunState.save();
        return res.json(result);
    }

    // If no existing fun facts, create a new entry in the database
    try {
        const result = await StatesFunFact.create({
            code: state.code,
            funfacts: req.body.funfacts
        });
        return res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Update an existing fun fact for a state
const patchFunFact = async (req, res) => {
    // Check if the request body contains the index and fun fact values
    if (!req.body?.index) return res.status(400).json({ message: 'State fun fact index value required' });
    if (!req.body.funfact || typeof req.body.funfact !== "string" || req.body.funfact === "") {
        return res.status(400).json({ message: "State fun fact value required" });
    }

    // Find the state based on the provided code
    const state = await State.findOne({ code: req.params.code.toUpperCase() }).exec();
    if (!state) return res.status(400).json({ message: "Invalid state abbreviation parameter" });

    // Find the existing fun facts for the state
    const funState = await StatesFunFact.findOne({ code: state.code }).exec();
    if (!funState) return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });

    // Check if the index is within the bounds of the fun facts array
    if (funState.funfacts.length < req.body.index) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${state.state}` });
    }

    // Update the fun fact at the specified index
    funState.funfacts[req.body.index - 1] = req.body.funfact;
    const result = await funState.save();
    res.json(result);
}

// Delete an existing fun fact for a state
const deleteFunFact = async (req, res) => {
    // Check if the request body contains the index value
    if (!req.body?.index) return res.status(400).json({ message: 'State fun fact index value required' });

    // Find the state based on the provided code
    const state = await State.findOne({ code: req.params.code.toUpperCase() }).exec();
    if (!state) return res.status(400).json({ message: "Invalid state abbreviation parameter" });

    // Find the existing fun facts for the state
    const funState = await StatesFunFact.findOne({ code: state.code }).exec();
    if (!funState) return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });

    // Check if the index is within the bounds of the fun facts array
    if (funState.funfacts.length < req.body.index) {
        return res.status(400).json({ message: `No Fun Fact found at that index for ${state.state}` });
    }

    // Remove the fun fact at the specified index
    funState.funfacts.splice(req.body.index - 1, 1);
    const result = await funState.save();
    res.json(result);
}

// Retrieve a random fun fact for a state
const getFunFact = async (req, res) => {
    // Find the state based on the provided code
    const state = await State.findOne({ code: req.params.code.toUpperCase() }).exec();
    if (!state) return res.status(400).json({ message: "Invalid state abbreviation parameter" });

    // Find the existing fun facts for the state
    const stateWithFunFacts = await StatesFunFact.findOne({ code: state.code }).exec();
    if (!stateWithFunFacts) return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });

    // Retrieve a random fun fact from the array of fun facts
    res.json({ funfact: stateWithFunFacts.funfacts[Math.floor(Math.random() * stateWithFunFacts.funfacts.length)] });
}

module.exports = {
    getFunFact,
    createNewFunFact,
    patchFunFact,
    deleteFunFact
}
