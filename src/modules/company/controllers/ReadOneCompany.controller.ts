import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { showCompany } from "@/modules/company/view/showCompany.view";

export class ReadOneCompanyController extends ActionController {
  private repository = this.makeRepository(CompanyRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID:',
      min: 1,
    });

    if (!id) {
      console.log('Cancelled.');

      return;
    }

    const company = await this.repository.findCompanyById(id);

    if (!company) {
      console.log(`Company with id ${id} not found.`);

      return;
    }

    showCompany(company);
  }
}
