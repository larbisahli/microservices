// Original file: src/proto/serviceRoutes.proto

export interface InvalidateResourceRequest {
  alias?: string;
  resourceName?: string;
  packageName?: string;
}

export interface InvalidateResourceRequest__Output {
  alias: string;
  resourceName: string;
  packageName: string;
}
