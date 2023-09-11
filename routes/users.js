var express = require('express');
var router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log('file', file);
        cb(null, './imagenes/avatar')  //acá define el destino donde voy a guardar las imagenes
    },
    filename: function (req, file, cb) {
       // console.log('file', file);
        cb(null, Date.now() + '-' + file.originalname)
    }
  })
   
  const upload = multer({ storage: storage })

const UserController = require('../controllers/UserController');
const tokenController = require('../middlewares/tokenValidate');
const userValidate = require('../middlewares/userValidate');

/* GET users listing. */
router.post('/login', UserController.login);
router.get('/token', tokenController.decoToken, UserController.BuscarUser);
router.post('/singup', userValidate.validateRegistro , UserController.registroUser);


module.exports = router;
