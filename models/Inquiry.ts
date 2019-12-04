export class Inquiry {
  content!: string;
  mailAddress: string | null = null;
  inquiryType!: InquiryType;
}

export interface InquiryType {
  id: number;
  type: string;
  sortOrder: number;
}
