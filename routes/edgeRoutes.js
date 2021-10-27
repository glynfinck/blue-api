const express = require('express');
const edgeController = require('../controllers/edgeController');
const authController = require('../controllers/authController');

const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    edgeController.getAllEdges
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    edgeController.createEdge
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    edgeController.getEdge
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    edgeController.updateEdge
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    edgeController.deleteEdge
  );

module.exports = router;
