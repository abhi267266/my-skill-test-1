
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Student = require('../model/student');


module.exports.createOrUpdateStudent = async (req, res) => {

  try {
    const {name, email,college, status, dsaFinalScore, webDFinalScore, reactFinalScore, companyName, date, result } = req.body;
    const student = await Student.findOne({ email });
    if (student) {
      // Student exists, update the data
      student.name = name;
      student.college = college;
      student.status = status;
      student.courseScores.dsaFinalScore = dsaFinalScore;
      student.courseScores.webDFinalScore = webDFinalScore;
      student.courseScores.reactFinalScore = reactFinalScore;
      student.interviews = [];
      student.createdBy = req.user._id;

      // Iterate through the companyName and date arrays to create interview objects
      for (let i = 0; i < companyName.length; i++) {
        const interview = {
          companyName: companyName[i],
          date: date[i]
        };
        student.interviews.push(interview);
      }

      student.result = result;

      const updatedStudent = await student.save();

      console.log(updatedStudent);
      // Handle the updatedStudent object as needed
      return res.redirect("/student/all");
    } else {
      // Student does not exist, create a new student
      const newStudent = new Student({
        name,
        email,
        college,
        status,
        courseScores:{
          dsaFinalScore,
          webDFinalScore,
          reactFinalScore
        },
        interviews: [],
        result,
        createdBy: req.user._id
      });

      // Iterate through the companyName and date arrays to create interview objects
      if(typeof(companyName) === 'object' && typeof(date) === 'object'){
        for (let i = 0; i < companyName.length; i++) {
          const interview = {
            companyName: companyName[i],
            date: date[i]
          };
          newStudent.interviews.push(interview);
        }
      }else{
        const interview = {
          companyName: companyName,
          date: date
        }
        newStudent.interviews.push(interview);
      }


      const createdStudent = await newStudent.save();

      console.log(createdStudent);
      // Handle the createdStudent object as needed

      return res.redirect("/student/all");
    }
  } catch (error) {
    console.error(error);
    // Handle the error
    res.redirect('back');
  }
}

module.exports.getAllStudents = async (req, res) => {
  try {
    const employee = req.user;
    const students = await Student.find().populate('createdBy', 'name');  
    res.render('show-all-student', { students, employee });
  } catch (err) {
    console.error('Failed to fetch students:', err);
    req.flash('error', 'Failed to fetch students');
    res.redirect('/');
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const studentId =req.params.id;
    await Student.findByIdAndRemove(studentId);
    return res.redirect('/student/all');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.download = async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all students from the database

    const csvWriter = createCsvWriter({
      path: 'student_table.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'college', title: 'College' },
        { id: 'status', title: 'Status' },
        { id: 'dsaFinalScore', title: 'DSA Final Score' },
        { id: 'webDFinalScore', title: 'WebD Final Score' },
        { id: 'reactFinalScore', title: 'React Final Score' },
        { id: 'interviews', title: 'Interviews' },
        { id: 'result', title: 'Result' },
        { id: 'createdBy', title: 'Created By' }
      ]
    });

    const records = students.map((student) => {
      const courseScores = student.courseScores;
      return {
        name: student.name,
        email: student.email,
        college: student.college,
        status: student.status,
        dsaFinalScore: courseScores.dsaFinalScore,  
        webDFinalScore: courseScores.webDFinalScore,
        reactFinalScore: courseScores.reactFinalScore,
        interviews: student.interviews,
        result: student.result,
        createdBy: student.createdBy
      };
    });

    csvWriter
      .writeRecords(records)
      .then(() => {
        fs.createReadStream('student_table.csv')
          .pipe(csv())
          .on('data', (data) => {
            // Modify the data if necessary
          })
          .on('end', () => {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=student_table.csv');
            fs.createReadStream('student_table.csv').pipe(res);
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}