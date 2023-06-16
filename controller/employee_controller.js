const bcrypt = require('bcrypt');
const Employee = require('../model/employe');


module.exports.signup = async (req, res)=>{
    return res.render('sign-up');
}

module.exports.login = async (req, res)=>{
    return res.render('log-in');
}

module.exports.createSession = async (req, res)=>{
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.create = async (req, res)=>{
    const {name, email, password} = req.body;

    try {

        const exEmployee = await Employee.findOne({email});
        if (exEmployee) {
            req.flash('error', 'Employee with this email already exists');
            return res.redirect('/employee/log-in');
          }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('')


        const newEmployee = new Employee({
            name,
            email,
            password: hashedPassword
          });

          await newEmployee.save();

    req.flash('success', 'Employee registered successfully');
    res.redirect('/employee/log-in');
        
    } catch (error) {
        console.error('Failed to create employee:', error);
        req.flash('error', 'Failed to create employee');
        res.redirect('/employee/sign-up');
    }
}


module.exports.showProfile =  async (req, res) => {
    try {
      const employee = req.user; // Access authenticated employee from req.user
      res.render('employee-profile', { employee });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  module.exports.updateProfile = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      await Employee.findByIdAndUpdate(req.params.id, { name, email, password });
      res.redirect('/employee/profile/' + req.params.id);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  module.exports.destroySession = function(req, res){
    req.logout(function (err) {
      if (err) {
        console.log('Error logging out:', err);
        return res.redirect('/'); // Handle the error case, e.g., redirect to home page
      }
      // Redirect the employee to the desired page after logout
      return res.redirect('/employee/log-in');
    });
}