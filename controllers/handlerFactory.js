const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const constructData = (name, doc) => {
  const data = {};
  data[`${name.toLowerCase()}`] = doc;
  return data;
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Get specific model by id and delete
    const doc = await Model.findByIdAndDelete(req.params.id);

    // 2) Check if the instance of the model exists
    if (!doc) {
      return next(
        new AppError(
          `No ${Model.collection.modelName} found with this id.`,
          404
        )
      );
    }

    // 3) Send response
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Get specific model by id and update
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // 2) Check if the instance of the model exists
    if (!doc) {
      return next(
        new AppError(
          `No ${Model.collection.modelName} found with this id.`,
          404
        )
      );
    }

    // 3) Create output data object
    const data = constructData(Model.collection.modelName, doc);

    res.status(200).json({
      status: 'success',
      data,
    });
  });

exports.getOne = (Model, ...populateOptions) =>
  catchAsync(async (req, res, next) => {
    // 1) Get specific model by id
    let query = Model.findById(req.params.id);

    // 2) Pass populate options if given
    if (populateOptions) {
      for (let option of populateOptions) {
        query = query.populate(option);
      }
    }
    const doc = await query;

    // 3) Check if the instance of the model exists
    if (!doc) {
      return next(
        new AppError(
          `No ${Model.collection.modelName} found with this id.`,
          404
        )
      );
    }

    // 4) Create output data object
    const data = constructData(Model.collection.modelName, doc);

    // 5) Send response
    res.status(200).json({
      status: 'success',
      data,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    // 3) Create output data object
    const data = constructData(Model.collection.modelName, newDoc);

    res.status(201).json({
      status: 'success',
      data,
    });
  });

exports.getAll = (Model, nestedParams) =>
  catchAsync(async (req, res, next) => {
    // 1) If nestedParams are given then pre-filter the result
    /* The format for nested params is as follows:

          { NameOfFieldInMongo: NameOfNestedParam, etc... }
       
       You can input as many fields as you want for each nested parameter
    */
    let query = Model.find();
    if (nestedParams) {
      // Go through each nested parameter given
      for (let key of Object.keys(nestedParams)) {
        const subQuery = {};
        // Check if the nested parameter was provided by the user
        if (req.params[nestedParams[key]]) {
          subQuery[key] = req.params[nestedParams[key]];
          // Execute the subQuery to pre-filter the query
          query = Model.find(subQuery);
        }
      }
    }

    // 2) Run API Features Methods
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .pageinate();
    // const docs = await features.query.explain();
    const docs = await features.query;

    // 3) Create output data object
    const data = constructData(Model.collection.collectionName, docs);

    // 4) Send Response
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data,
    });
  });
