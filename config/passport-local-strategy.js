const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Use local strategy for employee authentication
const bcrypt = require('bcrypt');
const Employee = require('../model/employe');

// Define the LocalStrategy for employee authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    async function (req, email, password, done) {
      try {
        // Find the employee by email
        const employee = await Employee.findOne({ email });

        // If no employee found, return failure
        if (!employee) {
          req.flash('error', 'Invalid email or password');
          return done(null, false);
        }

        // Compare the entered password with the hashed password
        const passwordMatch = await bcrypt.compare(password, employee.password);

        // If passwords match, return success
        if (passwordMatch) {
          return done(null, employee);
        } else {
          req.flash('error', 'Invalid email or password');
          return done(null, false);
        }
      } catch (err) {
        console.error('Login error:', err);
        req.flash('error', 'Login error');
        return done(err);
      }
    }
  )
);

// Serialize the employee to decide which key is to be kept in the cookies
passport.serializeUser(function (employee, done) {
  done(null, employee.id);
});

// Deserialize the employee from the key in the cookies
passport.deserializeUser(function (id, done) {
  Employee.findById(id, function (err, employee) {
    if (err) {
      console.log('Error in finding employee --> Passport');
      return done(err);
    }

    return done(null, employee);
  });
});

// Check if the employee is authenticated
passport.checkAuthentication = function (req, res, next) {
  // If the employee is signed in, pass on the request to the next function (controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // If the employee is not signed in, redirect to the sign-in page
  return res.redirect('/employee/sign-up');
};
  
// Set the authenticated employee in locals for views
passport.setAuthenticatedEmployee = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.employee contains the current signed-in employee from the session cookie, and we are just sending this to the locals for the views
    res.locals.employee = req.employee;
  }

  next();
};

module.exports = passport;
