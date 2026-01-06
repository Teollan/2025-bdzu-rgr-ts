import { App } from '@/core/app/App';

export const main = async (): Promise<void> => {
  const app = await App.create();

  await app.run();
}

main()
