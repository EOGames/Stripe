require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const Routes = require('./routes/routes');

app.use(cors());
app.use(express.json());
app.use('/api',Routes);

app.listen(port,()=>
{
    console.log(`Server is Up and Running On ${port}`);
});
