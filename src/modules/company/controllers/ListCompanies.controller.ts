import { ActionController } from '@/core/controller/ActionController';
import { CompanyRepository } from "@/modules/company/model";
import { CompanyView } from '@/modules/company/view/Company.view';

export class ListCompaniesController extends ActionController {
  private companyRepository = this.makeRepository(CompanyRepository);
  private companyView = this.makeView(CompanyView);

  public async run(): Promise<void> {
    const companies = await this.companyRepository.list();

    if (companies.length === 0) {
      this.io.say("No companies found.");

      return;
    }

    this.io.say("Companies found:");
    this.companyView.many(companies);
  }
}
