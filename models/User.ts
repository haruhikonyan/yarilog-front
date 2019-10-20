export class User {
  id: string | undefined;
  username: string | null = null;
  mailAddress: string | null = null;
  password: string | null = null;
  nickname!: string;
  description: string | null = null;
  externalAccount: ExternalAccount | undefined;
}

class ExternalAccount {
  providerType!: string;
}