import { Controller } from "@/core/controller";
import { CompanyRepository } from "@/modules/company/model";

export interface DeleteCompanyArgs {
  id: number;
}

type Args = DeleteCompanyArgs;

export class DeleteCompanyController extends Controller<Args> {
  private repository = new CompanyRepository();

  async run(args: Args): Promise<void> {
    const company = await this.repository.deleteCompany(args.id);
    
    console.log(`Company ${company.id} deleted successfully`);
  }
}
