import { App } from '@/core/app/App';

export const main = async (): Promise<void> => {
  const app = new App();

  await app.init();

  await app.run();
}

main()
