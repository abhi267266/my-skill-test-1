const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
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
      type: Date,
      required: true
    }
  }],
    result: {
      type: String,
      enum: ['PASS', 'FAIL', 'On Hold', 'Didn’t Attempt'],
      required: true
    }
});

const studentModel = mongoose.model('Student', studentSchema);

module.exports = studentModel;
