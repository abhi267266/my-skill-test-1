module.exports.home = async (req, res)=>{

    try{
        // populate the user of each post
        const employee = req.user;
        

       return res.render('home', {
           title: "Codeial | Home",
           employee:employee
       });

   }catch(err){
       console.log('Error', err);
       return;
   }

}