import { Country } from "./Country";

export interface Composer {
  id: string | null
  lastName: string
  fullName: string
  description: string
  countries: Country[]
}
