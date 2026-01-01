import { Controller } from "@/core/controller";
import { CompanyRepository } from "@/modules/company/model";
import { showCompany } from '@/modules/company/view';

export interface UpdateCompanyArgs {
  id: number;
  name?: string;
}

type Args = UpdateCompanyArgs;

export class UpdateCompanyController extends Controller<Args> {
  private repository = new CompanyRepository();

  async run({ id, ...updates }: Args): Promise<void> {
    const company = await this.repository.updateCompany(id, updates);
    
    console.log(`Company ${company.id} updated successfully`);
    showCompany(company);
  }
}
