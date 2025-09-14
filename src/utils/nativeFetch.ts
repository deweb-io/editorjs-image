/**
 * Native fetch utilities to replace @codexteam/ajax functionality
 */

/**
 * Configuration options for file selection dialog
 */
export interface FileSelectionOptions {
  /**
   * The accepted file types (MIME types)
   */
  accept: string;
}

/**
 * Configuration options for fetch requests
 */
export interface FetchOptions {
  /**
   * The URL to which the request is sent
   */
  url: string;
  /**
   * The data to send with the request
   */
  data?: Record<string, unknown> | FormData;
  /**
   * The accepted file types (for file upload)
   */
  accept?: string;
  /**
   * The headers to send with the request
   */
  headers?: Record<string, string>;
  /**
   * A function to call before the request is sent, with the files to be sent
   */
  beforeSend?: (files: File[]) => void;
  /**
   * The name of the field in the form data to which the file should be assigned
   */
  fieldName?: string;
  /**
   * The type of the request content
   */
  type?: string;
}

/**
 * Response format matching the original ajax response
 */
export interface FetchResponse<T = Record<string, unknown>> {
  /**
   * The response body data
   */
  body: T;
}

/**
 * Content types
 */
export const contentType = {
  JSON: 'application/json',
};

/**
 * Prompts the user to select files and returns a promise that resolves with the selected files
 * Replaces ajax.selectFiles()
 * @param options - Configuration for file selection
 * @returns Promise that resolves with selected files
 */
export function selectFiles(options: FileSelectionOptions): Promise<File[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = options.accept;
    input.multiple = false;

    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;

      if (files && files.length > 0) {
        resolve(Array.from(files));
      } else {
        reject(new Error('No files selected'));
      }
    };

    input.oncancel = () => {
      reject(new Error('File selection cancelled'));
    };

    // Trigger the file selection dialog
    input.click();
  });
}

/**
 * Uploads files using FormData and fetch
 * Replaces ajax.transport()
 * @param options - Configuration for the upload request
 * @returns Promise that resolves with upload response
 */
export async function transport(options: FetchOptions): Promise<FetchResponse> {
  try {
    // First, get the files using selectFiles
    const accept = options.accept ?? 'image/*';
    const files = await selectFiles({ accept });

    // Call beforeSend if provided
    if (options.beforeSend) {
      options.beforeSend(files);
    }

    // Create FormData
    const formData = new FormData();

    // Add the file
    if (files.length > 0) {
      const fieldName = options.fieldName ?? 'image';

      formData.append(fieldName, files[0]);
    }

    // Add additional data if provided
    if (options.data && typeof options.data === 'object' && !(options.data instanceof FormData)) {
      Object.entries(options.data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });
    }

    // Make the fetch request
    const response = await fetch(options.url, {
      method: 'POST',
      body: formData,
      headers: options.headers || {},
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const body = await response.json() as Record<string, unknown>;

    return { body };
  } catch (error) {
    throw error instanceof Error ? error.message : String(error);
  }
}

/**
 * Sends a POST request with JSON data
 * Replaces ajax.post()
 * @param options - Configuration for the POST request
 * @returns Promise that resolves with response data
 */
export async function post(options: FetchOptions): Promise<FetchResponse> {
  try {
    const headers: Record<string, string> = {
      ...options.headers,
    };

    let body: string | FormData;

    // Handle different data types
    if (options.data instanceof FormData) {
      body = options.data;
      // Don't set Content-Type for FormData, let the browser set it
    } else if (options.type === contentType.JSON) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.data);
    } else {
      // Default to JSON
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.data);
    }

    const response = await fetch(options.url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    const responseBody = await response.json() as Record<string, unknown>;

    return { body: responseBody };
  } catch (error) {
    throw error instanceof Error ? error.message : String(error);
  }
}
