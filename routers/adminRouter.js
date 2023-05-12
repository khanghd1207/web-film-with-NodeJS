const express = require('express')
const csrf = require('csurf')
let csrfProtection = csrf({ cookie: true });
const admin = express()
const adminController = require('../controllers/adminController')
let flag = true
function test(req, res, next) {
    if (flag) {
        if (req.user) {
            req.logout()
            flag = false
            return next()
        }
        return next()
    }
    return next()
}

//admin.use(test)
admin.get("/user",csrfProtection,adminController.userList);

admin.get("/edituser/:id",csrfProtection,adminController.get_detail_user);

admin.delete("/user",adminController.del_user);
//get film
admin.get('/',csrfProtection, adminController.manage_film)
admin.get('/:id', adminController.detail_film)
//delete film
admin.delete('/', csrfProtection, adminController.del_film)
admin.get("/edituser/:id",csrfProtection,adminController.get_detail_user);
//GET GENRE
admin.get('/genre', csrfProtection, adminController.manage_genre)
//GET FILMS FOR MANAGE COMMENT
admin.get('/cmt', adminController.get_list_film)
//GET DETAIL COMMETN
admin.get('/cmt/:id', csrfProtection, adminController.get_detail_cmt)
//UPDATE genre
admin.put('/genre', csrfProtection, adminController.put_genre)
//delete genre
admin.delete('/genre', csrfProtection, adminController.del_genre)
//delete comment
admin.delete('/cmt', csrfProtection, adminController.del_cmt)
//add genre
// admin.post('/genre', csrfProtection, adminController.post_genre)
module.exports = admin
