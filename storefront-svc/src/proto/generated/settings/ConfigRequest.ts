// Original file: src/proto/settings.proto

export interface ConfigRequest {
  alias?: string;
  suid?: string;
  _suid?: 'suid';
}

export interface ConfigRequest__Output {
  alias: string;
  suid?: string;
  _suid: 'suid';
}
