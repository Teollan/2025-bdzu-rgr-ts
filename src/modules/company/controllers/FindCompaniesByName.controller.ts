import { Controller } from "@/core/controller";
import { CompanyRepository } from "@/modules/company/model";
import { showCompanies } from "@/modules/company/view";

export interface FindCompaniesByNameArgs {
  name: string;
}

type Args = FindCompaniesByNameArgs;

export class FindCompaniesByNameController extends Controller<Args> {
  private repository = new CompanyRepository();

  async run({ name }: Args): Promise<void> {
    const companies = await this.repository.findCompaniesByName(name);

    if (companies.length === 0) {
      console.log(`No companies found with name containing "${name}".`);

      return;
    }

    console.log("Companies found:");
    showCompanies(companies);
  }
}
