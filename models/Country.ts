import { Composer } from "./Composer";

export interface Country {
  // id は front から作成するときは null もしくは undefined だが、型はどう指定するべきか
  id: string | null
  name: string
  description: string
}
