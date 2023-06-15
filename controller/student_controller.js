module.exports.create = async (req, res) => {
    const {
      name,
      college,
      status,
      dsaFinalScore,
      webDFinalScore,
      reactFinalScore,
      companyName,
      date,
      result
    } = req.body;
  
    try {
      const newStudent = new Student({
        name,
        college,
        status,
        courseScores: {
          dsaFinalScore,
          webDFinalScore,
          reactFinalScore
        },
        interviews: [{
          companyName,
          date
        }],
        result
      });
  
      await newStudent.save();
  
      req.flash('success', 'Student details saved successfully');
      res.redirect('back'); // Redirect to the form page after saving
  
    } catch (err) {
      console.error('Failed to save data:', err);
      req.flash('error', 'Failed to save student details');
      res.redirect('back'); // Redirect to the form page with an error flash message
    }
  }