// Original file: src/proto/user.proto

export interface Store {
  id?: string;
  alias?: string;
  published?: boolean;
  tier?: string;
  storeName?: string;
  status?: string;
}

export interface Store__Output {
  id: string;
  alias: string;
  published: boolean;
  tier: string;
  storeName: string;
  status: string;
}
