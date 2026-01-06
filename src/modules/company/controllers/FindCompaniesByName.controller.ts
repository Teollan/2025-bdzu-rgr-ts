import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { showCompanies } from "@/modules/company/view/showCompanies.view";

export class FindCompaniesByNameController extends ActionController {
  private repository = this.makeRepository(CompanyRepository);

  async run(): Promise<void> {
    const { name } = await this.app.ask({
      name: 'name',
      type: 'text',
      message: 'Enter company name to search:',
    });

    if (!name) {
      console.log('Search cancelled.');

      return;
    }

    const companies = await this.repository.findCompaniesByName(name);

    if (companies.length === 0) {
      console.log(`No companies found with name containing "${name}".`);

      return;
    }

    console.log("Companies found:");
    showCompanies(companies);
  }
}
