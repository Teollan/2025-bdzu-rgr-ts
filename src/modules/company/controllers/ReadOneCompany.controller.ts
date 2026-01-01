import { Controller } from "@/core/controller";
import { CompanyRepository } from "@/modules/company/model";
import { showCompany } from "@/modules/company/view";

export interface ReadOneCompanyArgs {
  id: number;
}

type Args = ReadOneCompanyArgs;

export class ReadOneCompanyController extends Controller<Args> {
  private repository = new CompanyRepository();

  async run({ id}: Args): Promise<void> {
    const company = await this.repository.findCompanyById(id);

    if (!company) {
      console.log(`Company with id ${id} not found.`);
      
      return;
    }

    showCompany(company);
  }
}
