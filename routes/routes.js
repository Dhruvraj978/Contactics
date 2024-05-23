const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');

//image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
})

var upload = multer({
    storage: storage,
}).single('image');


//insert an user into DBroute
router.post("/add", upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });
    user.save()
        .then(() => {
            req.session.message = {
                type: 'success',
                message: 'user added successfully'
            };
            res.redirect('/');
        })
        .catch((err) => {
            res.json({ message: err.message, type: 'danger' });
        });
})


//get all users route
router.get('/', (req, res) => {
    User.find()
        .then(users => {
            res.render('index', {
                title: 'Home page',
                users: users,
            });
        })
        .catch(err => {
            res.json({ message: err.message });
        });
});

router.get('/add', (req, res) => {
    res.render('add_user', { title: 'Add Users' });
})


//edit user
//edit user
//edit user
//edit user
router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then(user => {
            if (!user) {
                return res.redirect('/');
            }
            res.render('edit_users', {
                title: 'Edit User',
                user: user,
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
});

//update useer route
//update user route
router.post('/update/:id', upload, async(req, res) => {
    let id = req.params.id;
    let new_image = '';
    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        const user = await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });
        if (!user) {
            return res.json({ message: 'User not found', type: 'danger' });
        }
        req.session.message = {
            type: 'success',
            message: 'User updated successfully',
        };
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.json({ message: err.message, type: 'danger' });
    }
});

//delete user route
//delete user route
router.get('/delete/:id', async(req, res) => {
    let id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.json({ message: 'User not found' });
        }
        if (user.image !== '') {
            try {
                fs.unlinkSync('./uploads/' + user.image);
            } catch (err) {
                console.log(err);
            }
        }
        req.session.message = {
            type: 'info',
            message: 'User deleted successfully'
        };
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.json({ message: err.message });
    }
});


module.exports = router;