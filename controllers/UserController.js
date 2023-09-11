const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
require("dotenv").config();

const UserController={}

UserController.login = async (req,res) =>{
    if(req.body.tipo==="candidato"){
        const {email , password } = req.body;
        let loginSuccess = false;        
        req.getConnection((err, conm)=> {    
        //conm es la conexion y utiliza el metodo query para enviar la consulta
        conm.query ('SELECT * FROM tb_usuarios WHERE Email_user = ?',[email],(err, user)=>{        
            if(err){
                //en caso que exista un error va a mandar al navegador
                    res.json(err);
                    res.json ("ERROR EN SQL"); 
            } 
            //Valida si encuentra el usuario
            if(user[0]){
                //Si encuentra el usuario
                console.log(user[0].Clave);
                console.log(password);
                loginSuccess = bcryptjs.compareSync(password,user[0].Clave);          
                if(loginSuccess){
                        try {
                                const userLogged = {
                                    "nombre": user[0].Nombre_user,
                                    "email": user[0].Email_user,
                                    "avatar": user[0].Avatar_user,
                                    "tipouser": user[0].Id_tpuser
                                }
                                const payload = {
                                    user: {
                                        id: user[0].Id_user,
                                    }
                                }
                                jwt.sign(payload, `process.env.SECRET_WORD`, { expiresIn: '1h' }, (error, token) => {
                                    if (error) {
                                        throw (error);
                                    }
                                    return res.status(200).json({ message: "Usuario Logeado", icon: "success", dataUser: userLogged, token });
                                });                                
                        } catch (error) {
                                return res.status(400).json({ message: "error " + error +" - " +`process.env.SECRET_WORD`});
                            }       
                    }else{
                        res.status(401).json({ icono: 'error', message: 'Los Datos ingresados son incorrectos, favor de verificar!!!', tipoerror:'maldatos'});
                        console.log(loginSuccess);
                    }
                    }else{
                        res.status(401).json({ icono: 'error', message: 'El Correo ingresado no se encuentra resgistredo, Favor de crear una cuenta para poder ingresar', tipoerror:'noregistra'});
                    }        
            });        
        });        
    }else{
        const {emailEmp , passwordEmp } = req.body;
        let loginSuccess = false;        
        req.getConnection((err, conm)=> {    
        //conm es la conexion y utiliza el metodo query para enviar la consulta
        conm.query ('SELECT * FROM tb_usuarios WHERE Email_user = ?',[emailEmp],(err, user)=>{        
            if(err){
                //en caso que exista un error va a mandar al navegador
                    res.json(err);
                    res.json ("ERROR EN SQL"); 
            } 
            //Valida si encuentra el usuario
            if(user[0]){
                //Si encuentra el usuario               
                loginSuccess = bcryptjs.compareSync(passwordEmp,user[0].Clave);
                if(loginSuccess){
                        try {
                                const userLogged = {
                                    "nombre": user[0].nombreuser,
                                    "email": user[0].Email_user,
                                    "avatar": user[0].Avatar_user,
                                    "tipouser": user[0].Id_tpuser
                                }
                                const payload = {
                                    user: {
                                        id: user[0].Id_user,
                                    }
                                }
                                jwt.sign(payload, process.env.SECRET_WORD, { expiresIn: '1h' }, (error, token) => {
                                    if (error) {
                                        throw (error);
                                    }
                                    return res.status(200).json({ message: "Usuario Logeado", icon: "success", dataUser: userLogged, token });
                                });                                
                        } catch (error) {
                                return res.status(400).json({ message: "error " + error});
                            }       
                    }else{
                        res.status(401).json({ icono: 'error', message: 'Los Datos ingresados son incorrectos, favor de verificar!!!', tipoerror:'maldatos'});
                        console.log(loginSuccess);
                    }
                    }else{
                        res.status(401).json({ icono: 'error', message: 'El Correo ingresado no se encuentra resgistredo, Favor de crear una cuenta para poder ingresar', tipoerror:'noregistra'});
                    }        
            });        
        });        

    }
}
//Controllers Registracion de usuarios
UserController.registroUser = async (req, res) =>{    
    if(req.body.tipouser==="candidato"){
        const { apellido, clave, email, nombre, pais, tipouser } = req.body;
        const avatar='img/avatar/useavatar.png';
        let query="INSERT INTO `tb_usuarios` (`Nombre_user`,`Clave`,`Id_tpuser`,`Email_user`,`Avatar_user`)"+
        " VALUES ( ?, ?, ?, ?, ?);"
        let encryptedPass ;
        try {
            const salt = await bcryptjs.genSalt(10);
            encryptedPass = await bcryptjs.hash(clave, salt);
        } catch (error) {
            return res.status(error.code || 500).json({ message: error.message });
        }
        req.getConnection((errSql, conm)=>{                
            conm.query(query,[nombre, encryptedPass, tipouser, email, avatar],(errSql,results)=>{
                if(errSql){
                    console.error('Error en la consulta:', error);
                    res.status(500).json({ error: 'Eror al ejecutar SQL ->'+error});
                }else{                
                    if (results) {
                        res.status(200).json({ message: "Registro realizado correctamente, favor de verficar su correo para terminar con activacion de su usuario!!!", icon: "success"});
                    }else{                
                        res.status(401).json({ icono: 'error', message: 'Los dotos no se pude grabar, Intente mas tarde!!!', tipoerror:'erroregistro', errSql});
                    }                   
                }
            });            
        })
    }else{
        const { claveEmp, emailEmp, nombreEmp, paisEmp, tipouser } = req.body;
        const avatar='img/avatar/useavatar.png';
        let query="INSERT INTO `tb_usuarios` (`Nombre_user`,`Clave`,`Id_tpuser`,`Email_user`,`Avatar_user`)"+
        " VALUES ( ?, ?, ?, ?, ?);"
        let encryptedPass ;
        try {
            const salt = await bcryptjs.genSalt(10);
            encryptedPass = await bcryptjs.hash(claveEmp, salt);
        } catch (error) {
            return res.status(error.code || 500).json({ message: error.message });
        }
        req.getConnection((errSql, conm)=>{                
            conm.query(query,[nombreEmp, encryptedPass, tipouser, emailEmp, avatar],(errSql,results)=>{
                if(errSql){
                    console.error('Error en la consulta:', error);
                    res.status(500).json({ error: 'Eror al ejecutar SQL ->'+error});
                }else{                
                    if (results) {
                        res.status(200).json({ message: "Registro realizado correctamente, favor de verficar su correo para terminar con activacion de su usuario!!!", icon: "success"});
                    }else{                
                        res.status(401).json({ icono: 'error', message: 'Los dotos no se pude grabar, Intente mas tarde!!!', tipoerror:'erroregistro', errSql});
                    }                   
                }
            });            
        })
    }

    
}
//controllers Busqueda para Usuario
UserController.BuscarUser = (req, res) =>{
    req.getConnection((errSql, conm)=>{
        query = 'SELECT Nombre_user, Id_tpuser, Avatar_user, Email_user FROM tb_usuarios WHERE Id_user= ?'; 
        conm.query(query, [req.userId], (error, results) => {
            if(error){
                console.error('Error en la consulta:', error);
                res.status(500).json({ error: 'Eror al ejecutar SQL ->'+error});
            } else {
                if (results.length === 1) {
                    //return res.json({ message: "Usuario encontrado", icon: "success", findUser: results});
                    return res.json({results});
                }else{                
                    res.status(401).json({ icono: 'error', message: 'No se Encontraron Datos del Usuario', tipoerror:'noregistra'});
                }        
            }
        });
    });   
}
//envio de email para el usuario termine de validar los datos 
/* const sendEmailRegister = async (req, res) => {
    try {
        const { email } = req.body;
        const userFound = await User.findOne({ email }).select('-__V');
        const payload = {
            user: {
                id: userFound._id,
            }
        }
        jwt.sign(payload, process.env.SECRET_WORD, { expiresIn: '5*60' }, (error, token) => {
            if (error) {
                throw (error);
            }
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'arieldg37@gmail.com',
                    pass: 'vcydtsibhweqyxei'
                }
            });

            let mailOptions = {
                from: 'E-Commer Administacion',
                to: userFound.email,
                subject: 'Recuperación de contraseña',
                text: 'Hola,' + userFound.name + ' Para recuperar su contraseña tiene 10 minutos, haz clic en el siguiente enlace: \nhttp://localhost:3000/EditPassword#' + token + '\n\nSaludos,\nEl equipo de E-coomer'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return res.status(400).json({ message: "El email fue enviado correctamente." + error, icon: "success" });
                } else {
                    return res.status(200).json({ message: "El email fue enviado correctamente.", icon: "success" });
                }
            });
        });
    } catch (error) {
        return res.status(400).json({ message: 'Error ver' + error });
    }
} */

module.exports = UserController;