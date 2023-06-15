const bcrypt = require('bcrypt');
const Employee = require('../model/employe');


module.exports.signup = async (req, res)=>{
    return res.render('sign-up');
}

module.exports.login = async (req, res)=>{
    return res.render('log-in');
}

module.exports.createSession = async (req, res)=>{
    return res.send("hit the createSession")
}

module.exports.create = async (req, res)=>{
    const {name, email, password} = req.body;

    try {

        const exEmployee = await Employee.findOne({email});
        if (exEmployee) {
            req.flash('error', 'Employee with this email already exists');
            return res.redirect('/signup');
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
