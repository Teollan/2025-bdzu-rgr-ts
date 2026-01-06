import prompts from 'prompts';

export class InputOutput {
  public ask = prompts;

  public say(message: string): void {
    console.log(message);
  }

  public error(message: string): void {
    console.error(message);
  }
}