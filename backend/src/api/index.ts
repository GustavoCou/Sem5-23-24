import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';

import building from './routes/buildingRoute';
import floor from './routes/floorRoute';
import room from './routes/roomRoute';

import bridge from './routes/bridgeRoute';
import elevator from './routes/elevatorRoute';




import robot from './routes/robotRoute';
import robotType from './routes/robotTypeRoute';

export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	building(app);
	room(app);

	floor(app);
	elevator(app);
	bridge(app);
	robotType(app);
	robot(app);

	// Rota para responder a solicitações HEAD
	app.head('', (req, res) => {
		// Adiciona os cabeçalhos necessários
		res.setHeader('Content-Type', 'application/json');
		// Responde com um código de sucesso (200)
		res.sendStatus(200);
	});


	return app
}