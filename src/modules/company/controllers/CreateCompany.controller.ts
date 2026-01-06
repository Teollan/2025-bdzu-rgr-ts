import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { showCompany } from '@/modules/company/view/showCompany.view';

export class CreateCompanyController extends ActionController {
  private repository = this.makeRepository(CompanyRepository);

  async run(): Promise<void> {
    const { name } = await this.app.ask({
      name: 'name',
      type: 'text',
      message: 'Enter company name:',
    });

    if (!name) {
      console.log('Company creation cancelled.');

      return;
    }

    const company = await this.repository.createCompany({ name });

    console.log(`Company created with id ${company.id}`);
    showCompany(company);
  }
}
