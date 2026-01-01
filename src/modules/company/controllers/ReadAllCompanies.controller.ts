import { Controller } from "@/core/controller";
import { CompanyRepository } from "@/modules/company/model";
import { showCompanies } from "@/modules/company/view";

export type ReadAllCompaniesArgs = {
  limit: number;
  offset: number;
}

type Args = ReadAllCompaniesArgs;

export class ReadAllCompaniesController extends Controller<Args> {
  private repository = new CompanyRepository();

  async run(args: Args): Promise<void> {
    const companies = await this.repository.getAllCompanies(args);

    if (companies.length === 0) {
      console.log("No companies found.");

      return;
    }

    console.log("Companies found:");
    showCompanies(companies);
  }
}
