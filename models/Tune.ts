import { Composer } from "./Composer";

export class Tune {
  id: number | undefined;
  title!: string;
  description: string | null = null;
  composer!: Composer;
}
