function required(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable "${name}". Add it to the .env file.`);
  }
  return value;
}

export const environment = {
  appName: required('NG_APP_NAME', import.meta.env.NG_APP_NAME),
  apiUrl: required('NG_APP_API_URL', import.meta.env.NG_APP_API_URL),
  enableLogging: import.meta.env.NG_APP_ENABLE_LOGGING === 'true',
} as const;
