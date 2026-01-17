import { View } from '@/core/view/View';
import { Company, CompanyWithCustomerCount } from '@/modules/company/Company.entity';

export class CompanyView extends View {
  one(company: Company): void {
    this.io.object(company);
  }

  many(companies: Company[]): void {
    this.io.table(companies);
  }

  companiesWithCustomerCount(companies: CompanyWithCustomerCount[]): void {
    this.io.table(companies, {
      columns: [
        ['Company Name', 'companyName'],
        ['Customer Count', 'customerCount'],
      ]
    });
  }
}
