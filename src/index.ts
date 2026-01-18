import 'dotenv/config';
import { App } from '@/core/app/App';

App.start().catch((error) => {
  console.error('Failed to start the application:', error);
});
