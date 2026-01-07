import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { CompanyView } from '@/modules/company/view/Company.view';

export class UpdateCompanyController extends ActionController {
  private companyRepository = this.makeRepository(CompanyRepository);
  private companyView = this.makeView(CompanyView);

  async run(): Promise<void> {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID to update:',
      min: 1,
    });

    const { name } = await this.io.ask({
      name: 'name',
      type: 'text',
      message: 'Enter new company name (leave empty to skip):',
    });

    if (!name) {
      this.io.say('No changes made.');

      return;
    }

    const company = await this.companyRepository.update(id, { name });

    this.io.say(`Company ${company.id} updated successfully`);
    this.companyView.one(company);
  }
}
