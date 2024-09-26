const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register a new user or admin
const register = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = new User({
            username,
            password, 
            role
        });
        await user.save();
        res.status(201).json({ message: 'User Register' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Error registering user' });
    }
}

//login
const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Error login user' });
    }
}

module.exports = {
    register,
    login
}