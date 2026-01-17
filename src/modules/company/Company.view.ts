import { View } from '@/core/view/View';
import { Company, CompanyWithCustomerCount } from '@/modules/company/Company.entity';

export class CompanyView extends View {
  showCompany(company: Company): void {
    this.object(company);
  }

  showCompanies(companies: Company[]): void {
    this.table(companies, {
      columns: [
        ['ID', 'id'],
        ['Name', 'name'],
      ],
    });
  }

  showCompaniesWithCustomerCount(companies: CompanyWithCustomerCount[]): void {
    this.table(companies, {
      columns: [
        ['Company Name', 'companyName'],
        ['Customer Count', 'customerCount'],
      ],
    });
  }
}
