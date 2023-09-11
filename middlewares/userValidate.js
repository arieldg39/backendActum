

const userValidate = {}



userValidate.validateRegistro = async(req, res, next) =>{    
    if(req.body.tipouser==="candidato"){
        try {
            const { apellido, clave, email, nombre, repiclave ,tipouser } = req.body;
            if (!clave || !email || !nombre || !apellido || !tipouser){
                return res.status(400).json({ message: "Por favor complete todos los campos", tipoerror: "error" });
            }        

            if (clave != repiclave) {
                return res.status(400).json({ message: "Las claves ingresadas no coinciden, favor de verficar!!!", tipoerror: "error" });
            }
            //Valida que la clave tenga al menos 8 caracteres
            if (clave.length < 6) {
                return res.status(400).json({ message: "La clave debe tener al menos 6 caracteres", tipoerror: "error" });
            }
            //Valida que el email no se encuentre en uso
            req.getConnection((erorSlq, conm)=>{
                conm.query ('SELECT * FROM tb_usuarios WHERE Email_user = ?',[email],(err, user)=>{        
                    if(err){
                        //en caso que exista un error va a mandar al navegador
                            res.json(err);
                            res.json ("ERROR EN SQL"); 
                    }
                    //Valida si encuentra el usuario
                    console.log(user[0])
                    if(user[0]){                         
                        res.status(400).json({ message: "El email ingresado ya se encuentra en uso, favor de verificar!!!", tipoerror: "error" });
                        
                    }else{
                        next();
                    }
                });
            });        
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }else{
        try {
            const { claveEmp, emailEmp, nombreEmp, paisEmp, repiclaveEmp, tipouser } = req.body;
            
            if (!claveEmp || !emailEmp || !nombreEmp || !tipouser){
                return res.status(400).json({ message: "Por favor complete todos los campos", tipoerror: "error" });
            }        
            if (claveEmp != repiclaveEmp) {
                return res.status(400).json({ message: "Las claves ingresadas no coinciden, favor de verficar!!!", tipoerror: "error" });
            }
            //Valida que la clave tenga al menos 8 caracteres
            if (claveEmp.length < 6) {
                return res.status(400).json({ message: "La clave debe tener al menos 6 caracteres", tipoerror: "error" });
            }
            //Valida que el email no se encuentre en uso
            req.getConnection((erorSlq, conm)=>{
                conm.query ('SELECT * FROM tb_usuarios WHERE Email_user = ?',[emailEmp],(err, user)=>{        
                    if(err){
                        //en caso que exista un error va a mandar al navegador
                            res.json(err);
                            res.json ("ERROR EN SQL"); 
                    }
                    //Valida si encuentra el usuario
                    console.log(user[0])
                    if(user[0]){                         
                        res.status(400).json({ message: "El email ingresado ya se encuentra en uso, favor de verificar!!!", tipoerror: "error" });
                        
                    }else{
                        next();
                    }
                });
            });        
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }    
    }    
}

module.exports = userValidate;