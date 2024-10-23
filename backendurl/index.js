const express = require('express');


const app = express();
const port =process.env.PORT || 3000;

const urlRouter = require('./routes/url');
const {connect}=require('./connect');
const URL = require('./models/url');
app.use(express.json()); 


connect('mongodb://localhost:27017/url-shortener')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

app.use("/url", urlRouter);

app.get('/:shortID', async (req, res) => {
    const shortID = req.params.shortID;
    const result= await URL.findOneAndUpdate({ 
        shortID },
        {
            $push: {
                visitHistory: {
                    timeStamp: Date.now()
                }
            }
        });
      res.redirect(result.redirectURL);

    }
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);