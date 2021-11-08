const AppError = require('./appError');
const APIFeatures = require('./apifeatures');

constructData = (name, doc) => {
  const data = {};
  data[`${name.toLowerCase()}`] = doc;
  return data;
};

exports.sendManyFound = (Model, res, next, docs) => {
  // 1) Create output data object
  const data = constructData(Model.collection.collectionName, docs);

  // 2) Send Response
  res.status(200).json({
    status: 'success',
    results: docs.length,
    data,
  });
};

exports.sendOneFound = (Model, res, next, doc) => {
  // 1) Check if the instance of the model exists
  if (!doc) {
    return next(
      new AppError(`No ${Model.collection.modelName} found with this id.`, 404)
    );
  }

  // 2) Create output data object
  const data = constructData(Model.collection.modelName, doc);

  // 3) Send response
  res.status(200).json({
    status: 'success',
    data,
  });
};

exports.sendOneCreated = (Model, res, next, doc) => {
  // 1) Check if the instance of the model exists
  if (!doc) {
    return next(
      new AppError(`No ${Model.collection.modelName} found with this id.`, 404)
    );
  }

  // 2) Create output data object
  const data = constructData(Model.collection.modelName, doc);

  // 3) Send response
  res.status(201).json({
    status: 'success',
    data,
  });
};

exports.sendOneDeleted = (Model, res, next, doc) => {
  // 1) Check if the instance of the model exists
  if (!doc) {
    return next(
      new AppError(`No ${Model.collection.modelName} found with this id.`, 404)
    );
  }

  // 2) Send response
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.queryMany = (req, Model, options) => {
  // 1) Initialize the query
  let query = Model.find();

  // 2) If filter provided then pass it in
  if (options && options.filter) {
    query = Model.find(options.filter);
  }

  // 3) Use nestedParams if provided
  if (options && options.nestedParams) {
    console.log(options);
    query = getNestedParamsQuery(req, query, options.nestedParams);
  }

  // 4) Run API Features Methods
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .pageinate();
  // const docs = await features.query.explain();
  return features.query;
};

// TODO: maybe refactor handlerFactory funtions into more general functions
// exports.queryAndSendOne = (Model, func, filter, res) => {};
// exports.createAndSendOne = (Model, func, doc, res) => {};

const getNestedParamsQuery = (req, query, nestedParams) => {
  /*  If nestedParams are given then pre-filter the result
        The format for nested params is as follows:

          { NameOfFieldInMongo: NameOfNestedParam, etc... }
      
        You can input as many fields as you want for each nested parameter
    */
  // Go through each nested parameter given
  for (let key of Object.keys(nestedParams)) {
    // Check if the nested parameter was provided by the user
    const subQuery = {};
    if (req.params[nestedParams[key]]) {
      // Add the parameter to the filter
      subQuery[key] = req.params[nestedParams[key]];
      query = query.find(subQuery);
    }
  }
  return query;
};
