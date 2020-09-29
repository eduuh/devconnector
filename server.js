const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

connectDB();
// Init Middleware.
app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.send('Api Running'));

const userRouter = require('./routes/api/user');
const authRouter = require('./routes/api/auth');
const profileRouter = require('./routes/api/profile');
const postRouter = require('./routes/api/post');

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/posts', postRouter);

const PORT = process.env.PORT || 5000;
console.log(process.env.PORT);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
