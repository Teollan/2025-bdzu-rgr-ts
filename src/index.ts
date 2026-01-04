import { Postgres } from '@/core/database';
import { App } from '@/core/app/App';

export const main = async (): Promise<void> => {
  await Postgres.connect();

  const program = new App();

  console.log('Welcome to the CRM application!');
  console.log('Type your commands below (type "exit" to quit).');
  console.log('Try using "help" to see available commands and how to use them.');

  while (true) {
    const input = await program.read();

    if (!input) {
      continue;
    }

    if (input.toLowerCase() === 'exit') {
      break;
    }

    try {
      await program.evaluate(input);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error(`An unknown error occurred: ${error}`);
      }
    }
  }

  console.log('Exiting application...');

  await Postgres.disconnect();

  process.exit(0);
}

main()
