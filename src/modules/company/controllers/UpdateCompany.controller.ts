import { Controller } from "@/core/controller";
import { CompanyRepository } from "@/modules/company/model";

export interface UpdateCompanyArgs {
  id: number;
  name?: string;
}

type Args = UpdateCompanyArgs;

export class UpdateCompanyController extends Controller<Args> {
  private repository = new CompanyRepository();

  async run(args: Args): Promise<void> {
    const company = await this.repository.updateCompany(args.id, args.name);
    
    console.log(`Company ${company.id} updated successfully`);
  }
}
