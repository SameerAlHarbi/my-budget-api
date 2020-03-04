// const errorMiddleware = (req,res, next) => {
//   throw new Error('Error from my middleware');
// }

// app.post('/upload', upload.single('upload'),(req, res) => {
//   res.send();
// });

// app.post('/upload', errorMiddleware,(req, res) => {
//   res.send();
// }, (error,req, res, next) => {
//   res.status(400).send({error: error.message});
// });

// app.post('/upload',  upload.single('upload'),(req, res) => {
//   res.send();
// }, (error,req, res, next) => {
//   res.status(400).send({error: error.message});
// });