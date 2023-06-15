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
    const students = await Student.find().populate('createdBy', 'name');
    res.render('show-all-student', { students });
  } catch (err) {
    console.error('Failed to fetch students:', err);
    req.flash('error', 'Failed to fetch students');
    res.redirect('/');
  }
};
