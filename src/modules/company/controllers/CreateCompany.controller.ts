import { Controller } from "@/core/controller";
import { CompanyRepository } from "@/modules/company/model";
import { showCompany } from '@/modules/company/view';

export interface CreateCompanyArgs {
  name: string;
}

type Args = CreateCompanyArgs;

export class CreateCompanyController extends Controller<Args> {
  private repository = new CompanyRepository();

  async run(args: Args): Promise<void> {
    const company = await this.repository.createCompany(args);
    
    console.log(`Company created with id ${company.id}`);
    showCompany(company);
  }
}
