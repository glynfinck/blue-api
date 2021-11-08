const admin = require('firebase-admin');
const client = require('firebase/app');
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} = require('firebase/auth');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const UserData = require('../models/userDataModel');

// eslint-disable-next-line node/no-unpublished-require
const serviceAccount = require('../private/firebase-service-account.json');

const firebaseClient = client.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY
});

const auth = getAuth(firebaseClient);

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.signUp = catchAsync(async (req, res, next) => {
  // 1) Check if email and password is provided
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError('Please provide an email and password'), 400);
  }

  // 2) Create new user using firebase client
  const firebaseResponse = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const { user } = firebaseResponse;
  const { accessToken, refreshToken, expirationTime } = user.stsTokenManager;

  // 3) Create new user on mongodb
  try {
    await UserData.create({ email: user.email, uid: user.uid });
  } catch (err) {
    // Delete newly created user on firebase and display error if unsuccessful
    await firebaseAdmin.auth().deleteUser(user.uid);
    next(err);
  }

  res.status(201).json({
    status: 'success',
    token: user.accessToken,
    accessToken,
    refreshToken,
    expirationTime
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  // 1) Check if email and password is provided
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError('Please provide an email and password'), 400);
  }

  // 2) Sign in user using firebase client
  const firebaseResponse = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const { user } = firebaseResponse;
  const { accessToken, refreshToken, expirationTime } = user.stsTokenManager;

  res.status(200).json({
    status: 'success',
    accessToken,
    refreshToken,
    expirationTime
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it exists
  const { authorization } = req.headers;

  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access', 401)
    );
  }

  // 2) Verification token
  const decoded = await firebaseAdmin.auth().verifyIdToken(token, true);

  // 3) Get user info using id
  const firebaseUser = await firebaseAdmin.auth().getUser(decoded.user_id);

  // 4) Get corresponding mongodb user
  const mongoUser = await UserData.findOne({
    uid: firebaseUser.uid,
    email: firebaseUser.email
  });

  // 5) Grant access to the protected route
  req.user = mongoUser;
  // req.params.userId = user.uid;
  next();
});

exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    const currentUser = req.user;
    if (!roles.includes(currentUser.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  });
};

exports.filterByUser = (...unfilteredRoles) =>
  catchAsync(async (req, res, next) => {
    const filter = {};
    /* 1) If the filterAuthUser is specififed to true then filter for the model
            using the { user: req.user.uid }. Also only filter by user if admin the
            user is NOT also an admin.
    */
    const currentUser = req.user;
    if (!unfilteredRoles || !unfilteredRoles.includes(currentUser.role)) {
      filter.user = req.user.uid;
    }
    req.filter = filter;
    next();
  });
