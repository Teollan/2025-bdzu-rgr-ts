import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { CompanyView } from '@/modules/company/view/Company.view';

export class DeleteCompanyController extends ActionController {
  private companyRepository = this.makeRepository(CompanyRepository);
  private companyView = this.makeView(CompanyView);

  async run(): Promise<void> {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID to delete:',
      min: 1,
    });

    if (!id) {
      this.io.say('Deletion cancelled.');

      return;
    }

    const company = await this.companyRepository.delete(id);

    this.io.say(`Company ${company.id} deleted successfully`);
    this.companyView.one(company);
  }
}
