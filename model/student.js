const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['placed', 'not_placed'],
    required: true
  },
  courseScores: {
    dsaFinalScore: {
      type: Number,
      required: true
    },
    webDFinalScore: {
      type: Number,
      required: true
    },
    reactFinalScore: {
      type: Number,
      required: true
    }
  },
  interviews: [{
    companyName: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }],
  result: {
    type: String,
    enum: ['PASS', 'FAIL', 'On Hold', 'Didn’t Attempt'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
