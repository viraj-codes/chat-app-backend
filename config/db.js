const mongoose = require('mongoose')

const dbUrl = process.env.DATABASE_URL
// mongoose.connect(dbUrl)



// module.exports = async () => {
//     console.log('Test :>> ');
//     await mongoose.connect(dbUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }).then((res) => {
//       console.log("DB connected successfully")
//     }).catch((err) => {
//       console.log("DB connected failed")
//     });
  
//     return mongoose
//   };

  module.exports = mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((res) => {
    console.log("DB connected successfully")
  }).catch((err) => {
    console.log("DB connected failed")
  });