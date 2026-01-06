import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { showCompany } from '@/modules/company/view/showCompany.view';

export class UpdateCompanyController extends ActionController {
  private repository = this.makeRepository(CompanyRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID to update:',
      min: 1,
    });

    const { name } = await this.app.ask({
      name: 'name',
      type: 'text',
      message: 'Enter new company name (leave empty to skip):',
    });

    if (!name) {
      console.log('No changes made.');

      return;
    }

    const company = await this.repository.updateCompany(id, { name });

    console.log(`Company ${company.id} updated successfully`);
    showCompany(company);
  }
}
