import { Country } from "./Country";

export class Composer {
  id: number | undefined;
  displayName!: string;
  fullName!: string;
  description: string | null = null;
  countries: Country[] = [];
}
