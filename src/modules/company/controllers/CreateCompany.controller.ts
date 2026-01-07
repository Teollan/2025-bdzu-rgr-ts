import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { CompanyView } from '@/modules/company/view/Company.view';

export class CreateCompanyController extends ActionController {
  private companyRepository = this.makeRepository(CompanyRepository);
  private companyView = this.makeView(CompanyView);

  async run(): Promise<void> {
    const { name } = await this.io.ask({
      name: 'name',
      type: 'text',
      message: 'Enter company name:',
    });

    if (!name) {
      this.io.say('Company creation cancelled.');

      return;
    }

    const company = await this.companyRepository.create({ name });

    this.io.say(`Company created with id ${company.id}`);
    this.companyView.one(company);
  }
}
