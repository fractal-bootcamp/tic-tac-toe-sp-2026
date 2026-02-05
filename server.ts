import ViteExpress from 'vite-express';
import { app } from './src/server-app.js';

const PORT = process.env.PORT || 3000

ViteExpress.listen(app, PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});