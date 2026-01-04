import prompts from 'prompts';
import { companyCommandBranch } from "@/modules/company";
import { salesManagerCommandBranch } from "@/modules/sales-manager";
import { customerCommandBranch } from "@/modules/customer";
import { leadCommandBranch } from "@/modules/lead";
import { makeBranchCommand } from '@/core/command/makeBranchCommand';
import { Router } from '@/core/router/Router';

export class App {
  private runner = makeBranchCommand({
    name: '>',
    description: 'CRM Application Command Line Interface',
    helpCommand: true,
    subcommands: [
      companyCommandBranch,
      salesManagerCommandBranch,
      customerCommandBranch,
      leadCommandBranch,
    ],
  });

  private router = new Router({
    name: 'root',
    children: [
      {
        name: 'company',
        children: [],
      },
    ],
  });

  public async read(): Promise<string> {
    const { input } = await prompts({
      type: 'text',
      name: 'input',
      message: 'Enter your command:',
    });

    return input.trim();
  }

  public async evaluate(raw: string): Promise<void> {
    await this.runner.parseAsync(
      this.split(raw),
      { from: 'user' },
    );
  }

  public split(raw: string): string[] {
    const regex = /("[^"]*")|(\S+)/g;

    const tokens: string[] = [];

    for (const match of raw.matchAll(regex)) {
      tokens.push(match[1] ?? match[2]);
    }

    return tokens;
  }
}