const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const statesfunfactsController = require('../../controllers/statesfunfactsController');

// Routes for states
router.get('/', statesController.getAllStates);

router.get('/:code', statesController.getState);

router.get('/:code/capital', statesController.getCapital);

router.get('/:code/nickname', statesController.getNickname);

router.get('/:code/population', statesController.getPopulation);

router.get('/:code/admission', statesController.getAdmission);

// Routes for state fun facts
router.route('/:code/funfact')
    .get(statesfunfactsController.getFunFact)
    .post(statesfunfactsController.createNewFunFact)
    .patch(statesfunfactsController.patchFunFact)
    .delete(statesfunfactsController.deleteFunFact);

module.exports = router;
