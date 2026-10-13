declare interface Env {
  readonly NG_APP_NAME: string;
  readonly NG_APP_API_URL: string;
  readonly NG_APP_ENABLE_LOGGING: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
