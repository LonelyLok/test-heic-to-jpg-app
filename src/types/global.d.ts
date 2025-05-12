export interface BackendAPI {
  selectFolder: () => string;
  convertHeicToJpeg: (inputFolder: string, outputFolder: string) => Promise<void>;
}

declare global {
  interface Window {
    backendAPI: BackendAPI;
  }
}
