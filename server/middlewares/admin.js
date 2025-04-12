const isAdmin = async(req, res, next) => {
    try{
        if(req.user && req.user.isAdmin){
            next();
        } else{
            res.status(403).json({message: "Admins Only!"})
        }
    } catch(err){
        res.status(401).json({message: "Not Authorized!"})
    }

}

export default isAdmin;