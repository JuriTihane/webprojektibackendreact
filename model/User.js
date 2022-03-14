const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Include your name"]
    },
    password: {
        type: String,
        required: [true, "Please Include your password"]
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

// Tämä metodi hashaa salasanan ennen sitä tallentamista
userSchema.pre("save", async function(next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Tämä metodi generoi tokenin käyttäjälle
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id, name: user.name },
        "secret");
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

// Tämä metodi etsii käyttäjän usernamella ja salasanalla
userSchema.statics.findByCredentials = async (name, password) => {
    const user = await User.findOne({ name });
    if (!user) {
        throw new Error({ error: "Invalid login details" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error({ error: "Invalid login details" });
    }
    return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;