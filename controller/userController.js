const User = require("../model/User");

exports.registerNewUser = async (req, res) => {
    try {
        let userr = await User.find({name: req.body.name})
        if (userr.toString().length >= 1) {
            return res.status(409).json({
                message: "Username already in use"
            })
        }
        console.log("AAAAAAAA" + JSON.stringify(req.body))
        const user = new User({
            name: req.body.name,
            password: req.body.password
        });
        let data = await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({data, token});
    } catch (err) {
        console.log(err)
        res.status(400).json({err: err});
    }
};

exports.loginUser = async (req, res) => {
    try {
        const name = req.body.name;
        const password = req.body.password;
        const user = await User.findByCredentials(name, password);
        if (!user) {
            return res.status(401).json({ error: "Login failed! Check authentication credentials" });
        }
        const token = await user.generateAuthToken();
        res.status(201).json({ user, token });
    } catch (err) {
        res.status(400).json({ err: err });
    }
};

exports.getUserDetails = async (req, res) => {
    await res.json(req.userData);
};