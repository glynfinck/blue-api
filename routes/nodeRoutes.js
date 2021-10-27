const express = require('express');
const nodeController = require('../controllers/nodeController');
const authController = require('../controllers/authController');

const router = express.Router({
  mergeParams: true,
});

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    nodeController.getAllNodes
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    nodeController.createNode
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    nodeController.getNode
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    nodeController.updateNode
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    nodeController.deleteNode
  );

module.exports = router;
