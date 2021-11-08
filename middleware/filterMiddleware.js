const catchAsync = require('../utils/catchAsync');

exports.filterNestedRoutes = (nestedParams) =>
  catchAsync(async (req, res, next) => {
    /*  If nestedParams are given then pre-filter the result
        The format for nested params is as follows:

          { NameOfFieldInMongo: NameOfNestedParam, etc... }
      
        You can input as many fields as you want for each nested parameter
    */
    if (nestedParams) {
      // Go through each nested parameter given
      for (let key of Object.keys(nestedParams)) {
        // Check if the nested parameter was provided by the user
        console.log(key);
        if (req.params[nestedParams[key]]) {
          // Add the parameter to the filter
          req.filter[key] = req.params[nestedParams[key]];
        }
      }
    }
    next();
  });
