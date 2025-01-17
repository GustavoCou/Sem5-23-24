import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import taskRequest from './routes/taskRequestRoute';

export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
  taskRequest(app);
	return app
}
