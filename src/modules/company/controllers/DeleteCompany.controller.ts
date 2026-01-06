import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { showCompany } from '@/modules/company/view/showCompany.view';

export class DeleteCompanyController extends ActionController {
  private repository = this.makeRepository(CompanyRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID to delete:',
      min: 1,
    });

    if (!id) {
      console.log('Deletion cancelled.');

      return;
    }

    const company = await this.repository.deleteCompany(id);

    console.log(`Company ${company.id} deleted successfully`);
    showCompany(company);
  }
}
