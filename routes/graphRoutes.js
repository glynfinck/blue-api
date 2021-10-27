const express = require('express');
const authController = require('../controllers/authController');
const graphController = require('../controllers/graphController');

const nodeRouter = require('./nodeRoutes');
const edgeRouter = require('./edgeRoutes');

const router = express.Router();

router.use('/:graphId/nodes', nodeRouter);
router.use('/:graphId/edges', edgeRouter);

router
  .route('/')
  .get(authController.protect, graphController.getAllGraphs)
  .post(authController.protect, graphController.createGraph);

router
  .route('/:id')
  .get(authController.protect, graphController.getGraph)
  .patch(authController.protect, graphController.updateGraph)
  .delete(authController.protect, graphController.deleteGraph);

module.exports = router;
