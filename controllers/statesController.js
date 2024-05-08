const State = require('../model/State');
const Statesfunfact = require('../model/StatesFunFact');

// Retrieve all states with optional filtering for contiguous states
const getAllStates = async (req, res) => {
    let states = await State.find().lean();
    const funStates = await Statesfunfact.find();

    if (!states) return res.status(404).json({ message: "No states found." });

    for (state of states) {
        for (funState of funStates) {
            if (state.code === funState.code) {
                state.funfacts = funState.funfacts;
            }
        }
    }

    const nonContigStates = ["AK", "HI"];
    let newStates = [];

    if (req.query.contig == "true") {
        newStates = states.filter(state => !nonContigStates.includes(state.code));
    } else if (req.query.contig == "false") {
        newStates = states.filter(state => nonContigStates.includes(state.code));
    } else {
        newStates = states;
    }

    res.json(newStates);
}

// Retrieve details of a specific state
const getState = async (req, res) => {
    const funStates = await Statesfunfact.find();
    let state = await State.findOne({ code: req.params.code.toUpperCase() }).lean().exec();

    if (!state) return res.status(400).json({ message: "Invalid state abbreviation parameter" });

    delete state._id;

    for (funState of funStates) {
        if (state.code === funState.code) {
            state.funfacts = funState.funfacts;
        }
    }

    res.json(state);
}

// Retrieve capital city of a specific state
const getCapital = async (req, res) => {
    const state = await State.findOne({ code: req.params.code.toUpperCase() }).exec();

    if (!state) return res.status(400).json({ message: "Invalid state abbreviation parameter" });

    res.json({ state: state.state, capital: state.capital_city });
}

// Retrieve nickname of a specific state
const getNickname = async (req, res) => {
    const state = await State.findOne({ code: req.params.code.toUpperCase() }).exec();

    if (!state) return res.status(400).json({ message: "Invalid state abbreviation parameter" });

    res.json({ state: state.state, nickname: state.nickname });
}

// Retrieve population of a specific state
const getPopulation = async (req, res) => {
    const state = await State.findOne({ code: req.params.code.toUpperCase() }).exec();

    if (!state) return res.status(400).json({ message: "Invalid state abbreviation parameter" });

    res.json({ state: state.state, population: state.population.toLocaleString("en-US") });
}

// Retrieve admission date of a specific state
const getAdmission = async (req, res) => {
    const state = await State.findOne({ code: req.params.code.toUpperCase() }).exec();

    if (!state) return res.status(400).json({ message: "Invalid state abbreviation parameter" });

    res.json({ state: state.state, admitted: state.admission_date });
}

// Retrieve a random fun fact of a specific state
const getFunfact = async (req, res) => {
    const state = await State.findOne({ code: req.params.code.toUpperCase() }).exec();

    if (!state) return res.status(400).json({ message: "Invalid state abbreviation parameter" });

    res.json({ state: state.state, funfact: state.funfact });
}

module.exports = {
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    getFunfact
}
