const loginUser = require("../Model/LoginPageSchema");
const jwtMiddleware = require("../JWT");
const bcrypt = require("bcrypt");
const { sendPasswordResetEmail } = require("../NodeMailer");

const allUsers = async (req, res) => {
  try {
    const users = await loginUser.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addUser = async (req, res) => {
  try {
    const { username, password, resetString } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newLoginUser = new loginUser({
      username,
      password: hashedPassword,
      resetString,
    });
    await newLoginUser.save();
    const token = jwtMiddleware.generateToken({
      id: newLoginUser._id,
      username: newLoginUser.username,
    });

    res.status(201).json({ message: "User Added Successfully", token });
  } catch (error) {
    console.log(error);
    console.error("Error", error);
    res.status(501).json({ error: "Internal Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the user by username (email)
    const user = await loginUser.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a random reset string
    const randomResetString = Math.random().toString(36).substring(7);

    // Store the reset string in the user document
    user.resetString = randomResetString;
    await user.save();
    sendPasswordResetEmail(user.username, user.resetString);
    res.status(200).json({ message: "Link generated and sent successfully" });
  } catch (error) {
    console.error("Error generating password reset link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const validateResetPasswordLink = async (req, res) => {
  try {
    const { token } = req.query;

    // Find the user by the resetString (token)
    const user = await loginUser.findOne({ resetString: token });

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired token" });
    }

    // Check if the reset link has expired (optional)
    // You can add logic here to check the expiration time of the reset link if needed.
    user.resetString = "";
    user.save();
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Error validating reset link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const acceptUser = async (req, res) => {
  try {
    const { password, username } = req.body;

    // Find the user by username (email)
    const user = await loginUser.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // If the password is valid, generate a JWT
    const token = jwtMiddleware.generateToken({
      id: user._id,
      username: user.username,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the new password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the user by their username (email)
    const user = await loginUser.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addUser,
  resetPassword,
  allUsers,
  validateResetPasswordLink,
  acceptUser,
  updateUserPassword,
};
