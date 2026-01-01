import { Controller } from "@/core/controller";
import { CompanyRepository } from "@/modules/company/model";

export interface CreateCompanyArgs {
  name: string;
}

type Args = CreateCompanyArgs;

export class CreateCompanyController extends Controller<Args> {
  private repository = new CompanyRepository();

  async run(args: Args): Promise<void> {
    const company = await this.repository.createCompany(args.name);
    
    console.log(`Company created with id ${company.id}`);
  }
}
