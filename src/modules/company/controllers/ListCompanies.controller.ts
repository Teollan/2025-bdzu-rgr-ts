import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { showCompanies } from "@/modules/company/view/showCompanies.view";

export class ListCompaniesController extends ActionController {
  private repository = this.makeRepository(CompanyRepository);

  public async run(): Promise<void> {
    const companies = await this.repository.getAllCompanies();

    if (companies.length === 0) {
      console.log("No companies found.");

      return;
    }

    console.log("Companies found:");
    showCompanies(companies);
  }
}
