import { Application } from 'express';
import analytics from './analytics';
import media from './media';

const MountRoutes = (app: Application): void => {
  app.use('/media', media);
  app.use('/analytics', analytics);
};

export default MountRoutes;
