import { Country } from "./Country";

export class Composer {
  id: string | null = null;
  lastName: string | null = null;
  fullName: string | null = null;
  description: string | null = null;
  countries: Country[] = [];
}
