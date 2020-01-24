const jwt = require('jsonwebtoken');

exports.ListarUni = (req , res )=>{
    console.log(req)
    jwt.verify(req.token, 'secretkey123', (err, data) => {
		if(err) {
			res.sendStatus(403);
		} else {
			res.json({
				text: 'protected Response!',
				data
			});
		}
	});
}
exports.RevisarToken = (req , res , next) =>{
    const bearerHeader = req.body.accessToken;
    console.log(bearerHeader)
	console.log(req.body.accessToken)
	if(typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}