import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { CompanyView } from '@/modules/company/view/Company.view';

export class ReadOneCompanyController extends ActionController {
  private companyRepository = this.makeRepository(CompanyRepository);
  private companyView = this.makeView(CompanyView);

  async run(): Promise<void> {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID:',
      min: 1,
    });

    if (!id) {
      this.io.say('Cancelled.');

      return;
    }

    const company = await this.companyRepository.findById(id);

    if (!company) {
      this.io.say(`Company with id ${id} not found.`);

      return;
    }

    this.companyView.one(company);
  }
}
