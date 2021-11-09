const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const utils = require('../utils/handlerFactoryUtils');

exports.getAll = (Model, options) =>
  catchAsync(async (req, res, next) => {
    // 1) Get query for many of Model
    const query = utils.queryMany(req, Model, options);

    // 2) Execute query
    const docs = await query;

    // 4) Error Handle and Send Response
    utils.sendManyFound(Model, res, next, docs);
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // 1) Create doc
    const doc = req.body;

    // 2) Create new model
    const newDoc = await Model.create(doc);

    // 3) Error Handle and Send Response
    utils.sendOneCreated(Model, res, next, newDoc);
  });

exports.getOne = (Model, options) =>
  catchAsync(async (req, res, next) => {
    // 1) Construct the filter
    const filter = { ...req.filter, _id: req.params.id };

    // 3) Get specific model based on the filter
    let query = Model.findOne(filter);

    // 4) Pass populate options if given
    if (options && options.populateOptions) {
      options.populateOptions.forEach(opt => {
        query = query.populate(opt);
      });
    }

    const doc = await query;

    // 3) Error Handle and Send Response
    utils.sendOneFound(Model, res, next, doc);
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    // 1) Construct filter
    const filter = { ...req.filter, _id: req.params.id };

    // 2) Get specific model by id and update
    const doc = await Model.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    });

    // 3) Error Handle and Send Response
    utils.sendOneFound(Model, res, next, doc);
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    // 1) Construct filter
    const filter = { ...req.filter, _id: req.params.id };

    // 1) Get specific model by id and delete
    const doc = await Model.findOneAndDelete(filter);

    // 3) Error Handle and Send Response
    utils.sendOneDeleted(Model, res, next, doc);
  });

exports.getAllMy = (Model, options) =>
  catchAsync(async (req, res, next) => {
    // 1) Get the user id and initilize the query
    const userId = req.user.uid;

    // 2) Transform options to inlcude filter with user id
    const myOptions = { ...options, filter: { user: userId } };

    // 3) Get query for many of Model
    const query = utils.queryMany(req, Model, myOptions);

    // 4) Execute query
    const docs = await query;

    // 5) Error Handle and Send Response
    utils.sendManyFound(Model, res, next, docs);
  });

exports.createMyOne = Model =>
  catchAsync(async (req, res, next) => {
    // 1) Get the user id and problem id
    const userId = req.user.uid;

    // 2) Search for a model with id and userId
    const doc = await Model.create({ ...req.body, user: userId });

    // 3) Error Handle and Send Response
    utils.sendOneCreated(Model, res, next, doc);
  });

exports.updateMyOne = Model =>
  catchAsync(async (req, res, next) => {
    // 1) Get the user id and problem id
    const userId = req.user.uid;

    // 2) Construct filter
    const filter = { ...req.filter, _id: req.params.id, user: userId };

    // 3) Get specific model by id and update
    const doc = await Model.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    });

    // 4) Error Handle and Send Response
    utils.sendOneFound(Model, res, next, doc);
  });

exports.getMyOne = (Model, options) =>
  catchAsync(async (req, res, next) => {
    // 1) Get the user id and problem id
    const userId = req.user.uid;

    // 2) Construct filter
    const filter = { _id: req.params.id, user: userId };

    // 3) Search for a model with id and userId
    let query = Model.findOne(filter);

    // 4) Pass populate options if given
    if (options && options.populateOptions) {
      options.populateOptions.forEach(opt => {
        query = query.populate(opt);
      });
    }

    // 5) Execute query
    const doc = await query;

    // 6) Error Handle and Send Response
    utils.sendOneFound(Model, res, next, doc);
  });

exports.deleteMyOne = Model =>
  catchAsync(async (req, res, next) => {
    // 1) Get the user id and problem id
    const userId = req.user.uid;

    // 2) Construct filter
    const filter = { ...req.filter, _id: req.params.id, user: userId };

    // 3) Get specific model by id and delete
    const doc = await Model.findOneAndDelete(filter);

    // 4) Error Handle and Send Response
    utils.sendOneDeleted(Model, res, next, doc);
  });

exports.createMyParentsOne = (ChildModel, ParentModel, ref) =>
  catchAsync(async (req, res, next) => {
    // 1) Get the user id
    const userId = req.user.uid;

    // 2) Get user inputted data for the new node
    const parentId = req.body[ref];

    // 3) Get graph from the inputted graphId
    const parent = await ParentModel.findById(parentId);

    // 4) Check if the graph exists and if the user owns this graph
    if (!parent || (parent && parent.user !== userId)) {
      return next(new AppError('The graph inputted does not exist'), 400);
    }

    // 5) Create the new node
    const child = await ChildModel.create(req.body);

    // 6) Send response
    utils.sendOneCreated(ChildModel, res, next, child);
  });
