const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");

// Image upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads"); // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

// Middleware for image upload
const upload = multer({
    storage: storage,
}).single("image");

// Insert a user into the database route
router.post("/add", upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file ? req.file.filename : null, // Handle missing file gracefully
        });

        await user.save();

        req.session.message = {
            type: "success",
            message: "User added successfully",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Get all users route
router.get("/", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.render("index", {
            title: "Home Page",
            users: users, // Pass users data to the template
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

// GET route to render the edit form
router.get('/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Fetch the user by ID
        if (!user) {
            res.status(404).send("User not found!");
        } else {
            res.render('edit_user', { title: 'Edit User', user: user });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST route to handle updates
router.post('/update/:id', upload, async (req, res) => {
    try {
        let user = await User.findById(req.params.id); // Find the user by ID

        if (!user) {
            res.status(404).send("User not found!");
            return;
        }

        // Update user details from the form
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;

        // Check if a new image is uploaded
        if (req.file) {
            user.image = req.file.filename;
        }

        // Save the updated user
        await user.save();

        req.session.message = {
            type: 'success',
            message: 'User updated successfully!',
        };

        res.redirect('/');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// DELETE route to remove a user by ID
router.get('/delete/:id', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.session.message = {
      type: 'danger',
      message: 'Invalid user ID!',
    };
    return res.redirect('/');
  }

  try {
    const user = await User.findByIdAndDelete(id); // ✅ Fixed here

    if (!user) {
      req.session.message = {
        type: 'danger',
        message: 'User not found!',
      };
    } else {
      req.session.message = {
        type: 'success',
        message: 'User deleted successfully!',
      };
    }

    res.redirect('/');
  } catch (err) {
    console.error('Error deleting user:', err);
    req.session.message = {
      type: 'danger',
      message: 'Error deleting user!',
    };
    res.redirect('/');
  }
});





// Render Add User Page
router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });
});

module.exports = router;

// UPDATE COLUMN1 FROM MYTABLE
const obj = {
    "name": "Priyanshu",
    "Dob": "02/03/2002"
}

