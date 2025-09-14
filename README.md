![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Image Tool

Image Block for the [Editor.js](https://editorjs.io).

![](https://capella.pics/63a03d04-3816-45b2-87b2-d85e556f0066.jpg)

## Features

- Uploading file from the device
- Pasting copied content from the web
- Pasting images by drag-n-drop
- Pasting files and screenshots from Clipboard
- Allows adding a border, a background and a caption
- **NEW**: Link functionality - make images clickable with custom URLs
- **NEW**: Size presets - Small (30%), Medium (60%), and Full width (100%) options
- **NEW**: Alignment options - Left, Center, and Right alignment
- **NEW**: Enhanced UI with smooth transitions and modern styling
- **NEW**: Improved menu organization with nested submenus for better UX
- **NEW**: Native Fetch API - Removed external dependencies, now uses browser's native fetch instead of @codexteam/ajax

**Notes**

This Tool requires server-side implementation for the file uploading. See [backend response format](#server-format) for more details.

This Tool is also capable of uploading & displaying video files using the `<video>` element. To enable this, specify video mime-types via the 'types' config param.

**Compatibility**: This enhanced version maintains full backward compatibility with existing configurations and custom uploaders.

## Native Fetch Implementation

**Breaking Change Alternative**: As of this version, the tool no longer depends on `@codexteam/ajax` and instead uses the browser's native fetch API. This change:

- ✅ **Reduces bundle size** by eliminating external dependencies
- ✅ **Improves security** by removing third-party code
- ✅ **Maintains full compatibility** with existing backend implementations
- ✅ **Uses modern web standards** with native browser APIs

### Technical Changes
- File selection now uses native HTML file input instead of ajax.selectFiles()
- File uploads use fetch API with FormData for multipart uploads
- URL uploads use fetch API with JSON payloads
- All error handling and response formats remain identical

**No changes required** to your existing backend endpoints or custom uploader implementations.


## Installation

Get the package

```shell
npm i -E -S https://github.com/deweb-io/editorjs-image.git
```

Or for a specific version using branch:

```shell
npm i -E -S https://github.com/deweb-io/editorjs-image.git#v0.0.1
```

Include module at your application

```javascript
import ImageTool from '@creator/editorjs-image';
```

Optionally, you can load this tool from [JsDelivr CDN](https://cdn.jsdelivr.net/npm/@editorjs/image@latest)

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
import ImageTool from '@creator/editorjs-image';

// or if you inject ImageTool via standalone script
const ImageTool = window.ImageTool;

var editor = EditorJS({
  ...

  tools: {
    ...
    image: {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
          byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
        }
      }
    }
  }

  ...
});
```

## Config Params

Image Tool supports these configuration parameters:

| Field | Type     | Description        |
| ----- | -------- | ------------------ |
| endpoints | `{byFile: string, byUrl: string}` | Endpoints for file uploading. <br> Contains 2 fields: <br> __byFile__ - for file uploading <br> __byUrl__ - for uploading by URL |
| field | `string` | (default: `image`) Name of uploaded image field in POST request |
| types | `string` | (default: `image/*`) Mime-types of files that can be accepted with file selection. |
| additionalRequestData | `object` | Object with any data you want to send with uploading requests |
| additionalRequestHeaders | `object` | Object with any custom headers which will be added to request |
| captionPlaceholder | `string` | (default: `Caption`) Placeholder for Caption input |
| linkPlaceholder | `string` | (default: `Add link URL`) Placeholder for Link input |
| buttonContent | `string` | Allows to override HTML content of «Select file» button |
| uploader | `{{uploadByFile: function, uploadByUrl: function}}` | Optional custom uploading methods. See details below. |
| actions | `array` | Array with custom actions to show in the tool's settings menu. See details below. |
| features | `object` | Allows you to enable/disable additional features such as border, background, and caption. See details below. |

Note that if you don't implement your custom uploader methods, the `endpoints` param is required.

## Tool's settings

![](https://capella.pics/c74cdeec-3405-48ac-a960-f784188cf9b4.jpg)

**Main Settings:**
1. **With caption** - Toggle caption input visibility (enabled by default)
2. **With Link** - Toggle link input visibility (disabled by default, makes image clickable)

**Size submenu:**
3. **Small** - 30% width, centered
4. **Medium** - 60% width, centered  
5. **Full width** - 100% width

**Alignment submenu:**
6. **Left** - Align image to the left
7. **Center** - Center the image (default)
8. **Right** - Align image to the right

**Style submenu:**
9. **Border** - Add decorative border around image
10. **Background** - Add colored background behind image

Add extra setting-buttons by adding them to the `actions`-array in the configuration:
```js
actions: [
    {
        name: 'new_button',
        icon: '<svg>...</svg>',
        title: 'New Button',
        toggle: true,
        action: (name) => {
            alert(`${name} button clicked`);
        }
    }
]
```

**_NOTE:_**  return value of `action` callback for settings whether action button should be toggled or not is *deprecated*. Consider using `toggle` option instead.

You can disable features such as border, background, and caption by defining `features` in the configuration:
```js
features: {
  border: false,        // Disable border option
  background: false,    // Disable background option  
  caption: 'optional'   // Show caption as toggleable option (true/false to force show/hide)
}
```

**_NOTE:_** Set caption to `'optional'` to show it as a toggleable tune in the settings menu. Set to `true` to always show caption input, or `false` to always hide it.

## Enhanced Features

### Size and Alignment
The tool now includes built-in size presets and alignment options:

- **Size presets**: Choose from Small (30%), Medium (60%), or Full width (100%)
- **Alignment options**: Left, Center (default), or Right alignment
- **Visual feedback**: Smooth transitions when changing size or alignment

### Link Functionality
Make images clickable by enabling the link option:

- Toggle link input visibility in settings
- When enabled, adds a URL input field below the caption
- Links open in the current window/tab when image is clicked

### Modern UI
Enhanced user interface with improved usability:

- **Smooth transitions**: All hover and state changes are animated
- **Organized menus**: Related options grouped in logical submenus
- **Consistent styling**: Modern design with improved visual hierarchy
- **Better input design**: Compact inputs with focus states and hover effects

## Migration from Previous Versions

### Backward Compatibility
✅ **No breaking changes** - All existing configurations continue to work  
✅ **Custom uploaders preserved** - Your upload logic remains unchanged  
✅ **Data structure compatible** - Existing saved content loads correctly  
✅ **Native Fetch** - Removed @codexteam/ajax dependency for lighter bundle size  

### New Features Available
- **Size & Alignment**: Automatically available in settings menu
- **Link functionality**: Enable via "With Link" toggle in settings  
- **Enhanced UI**: Improved styling and transitions applied automatically

### Optional Configuration Updates
```js
// Optional: Configure new features
features: {
  caption: 'optional',  // Show caption as toggle instead of always visible
  border: true,         // Enable/disable border option (default: true)
  background: true      // Enable/disable background option (default: true)
}
```

## Technical Implementation

### Native Fetch API

This version has been updated to use the browser's native fetch API instead of the `@codexteam/ajax` library. The changes include:

#### What Changed
- **Dependency Removal**: No longer requires `@codexteam/ajax` package
- **File Selection**: Uses native HTML file input dialog
- **HTTP Requests**: All uploads now use fetch API with proper FormData/JSON handling
- **Error Handling**: Maintains the same error patterns with native JavaScript

#### Implementation Details
```javascript
// File selection (replaces ajax.selectFiles)
const selectFiles = (options) => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept;
    input.click();
    // ... handles file selection
  });
};

// File upload (replaces ajax.transport)
const transport = async (options) => {
  const files = await selectFiles({ accept: options.accept });
  const formData = new FormData();
  formData.append(options.fieldName, files[0]);
  
  const response = await fetch(options.url, {
    method: 'POST',
    body: formData,
    headers: options.headers
  });
  
  return { body: await response.json() };
};

// URL upload (replaces ajax.post)
const post = async (options) => {
  const response = await fetch(options.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: JSON.stringify(options.data)
  });
  
  return { body: await response.json() };
};
```

#### Benefits
- **Smaller Bundle**: Reduces package size by eliminating external dependencies
- **Better Security**: Fewer third-party dependencies reduce potential vulnerabilities  
- **Modern Standards**: Uses current web platform APIs
- **Better Performance**: Native browser APIs are typically faster than external libraries

#### Migration Impact
**Zero migration required** - All existing backend endpoints, custom uploaders, and configurations continue to work without any changes. The HTTP requests sent to your backend remain identical in format and structure.

#### Browser Compatibility
The native fetch API is supported in all modern browsers:
- Chrome 42+ (2015)
- Firefox 39+ (2015)  
- Safari 10.1+ (2017)
- Edge 14+ (2016)

For older browser support, you can include a fetch polyfill in your application.

## Output data

This Tool returns `data` with following format

| Field          | Type      | Description                     |
| -------------- | --------- | ------------------------------- |
| file           | `object`  | Uploaded file data. Any data got from backend uploader. Always contain the `url` property |
| caption        | `string`  | Image caption text                 |
| linkUrl        | `string`  | URL to make image clickable (empty string if no link)     |
| withBorder     | `boolean` | Whether image has decorative border             |
| withBackground | `boolean` | Whether image has colored background          |
| size           | `string`  | Size preset: `'small'`, `'medium'`, or `'full'` (default: `'full'`) |
| alignment      | `string`  | Image alignment: `'left'`, `'center'`, or `'right'` (default: `'center'`) |


```json
{
    "type" : "image",
    "data" : {
        "file": {
            "url" : "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg"
        },
        "caption" : "Roadster // tesla.com",
        "linkUrl" : "https://tesla.com/roadster",
        "withBorder" : false,
        "withBackground" : false,
        "size" : "full",
        "alignment" : "center"
    }
}
```

## Backend response format <a name="server-format"></a>

This Tool works by one of the following schemes:

1. Uploading files from the device
2. Uploading by URL (handle image-like URL's pasting)
3. Uploading by drag-n-drop file
4. Uploading by pasting from Clipboard

**Enhanced Image Tool maintains full backward compatibility** with existing custom uploader implementations. All additional properties returned by your custom uploader (such as `width`, `height`, `color`, `extension`, etc.) are preserved and available in the saved data.

### Uploading files from device <a name="from-device"></a>

Scenario:

1. User select file from the device
2. Tool sends it to **your** backend (on `config.endpoints.byFile` route)
3. Your backend should save file and return file data with JSON at specified format.
4. Image tool shows saved image and stores server answer

So, you can implement backend for file saving by your own way. It is a specific and trivial task depending on your
environment and stack.

The tool executes the request as [`multipart/form-data`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST), with the key as the value of `field`  in configuration.

The response of your uploader **should**  cover the following format:

```json5
{
    "success" : 1,
    "file": {
        "url" : "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
        // ... and any additional fields you want to store, such as width, height, color, extension, etc
    }
}
```

**success** - uploading status. 1 for successful, 0 for failed

**file** - uploaded file data. **Must** contain an `url` field with full public path to the uploaded image.
Also, can contain any additional fields you want to store. For example, width, height, id etc.
All additional fields will be saved at the `file` object of output data.

### Uploading by pasted URL

Scenario:

1. User pastes an URL of the image file to the Editor
2. Editor pass pasted string to the Image Tool
3. Tool sends it to **your** backend (on `config.endpoints.byUrl` route) via 'url' in request body
4. Your backend should accept URL, **download and save the original file by passed URL** and return file data with JSON at specified format.
5. Image tool shows saved image and stores server answer

The tool executes the request as `application/json` with the following request body:

```json5
{
  "url": "<pasted URL from the user>"
  "additionalRequestData": "<additional request data from configuration>"
}
```

Response of your uploader should be at the same format as described at «[Uploading files from device](#from-device)» section


### Uploading by drag-n-drop or from Clipboard

Your backend will accept file as FormData object in field name, specified by `config.field` (by default, «`image`»).
You should save it and return the same response format as described above.

## Providing custom uploading methods

As mentioned at the Config Params section, you have an ability to provide own custom uploading methods.
It is a quite simple: implement `uploadByFile` and `uploadByUrl` methods and pass them via `uploader` config param.
Both methods must return a Promise that resolves with response in a format that described at the [backend response format](#server-format) section.


| Method         | Arguments | Return value | Description |
| -------------- | --------- | -------------| ------------|
| uploadByFile   | `File`    | `{Promise.<{success, file: {url}}>}` | Upload file to the server and return an uploaded image data |
| uploadByUrl    | `string`  | `{Promise.<{success, file: {url}}>}` | Send URL-string to the server, that should load image by this URL and return an uploaded image data |

Example:

```js
import ImageTool from '@creator/editorjs-image';

var editor = EditorJS({
  ...

  tools: {
    ...
    image: {
      class: ImageTool,
      config: {
        /**
         * Custom uploader
         */
        uploader: {
          /**
           * Upload file to the server and return an uploaded image data
           * @param {File} file - file selected from the device or pasted by drag-n-drop
           * @return {Promise.<{success, file: {url}}>}
           */
          uploadByFile(file){
            // your own uploading logic here (using fetch, axios, or any HTTP client)
            return fetch('/upload', {
              method: 'POST',
              body: (() => {
                const formData = new FormData();
                formData.append('image', file);
                return formData;
              })()
            })
            .then(response => response.json())
            .then(result => {
              return {
                success: 1,
                file: {
                  url: result.url,
                  // any other image data you want to store, such as width, height, color, extension, etc
                }
              };
            });
          },

          /**
           * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
           * @param {string} url - pasted image URL
           * @return {Promise.<{success, file: {url}}>}
           */
          uploadByUrl(url){
            // your own uploading logic here (using fetch, axios, or any HTTP client)
            return fetch('/upload-by-url', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url })
            })
            .then(response => response.json())
            .then(result => {
              return {
                success: 1,
                file: {
                  url: result.url,
                  // any other image data you want to store, such as width, height, color, extension, etc
                }
              }
            })
          }
        }
      }
    }
  }

  ...
});
```

## Development & Contributing

### Publishing a New Release

This project includes an automated release script to streamline the publishing process. Follow these steps to publish a new version:

#### Quick Release
```bash
# For patch releases (bug fixes)
npm run release

# For minor releases (new features)  
npm run release:minor  

# For major releases (breaking changes)
npm run release:major
```

#### Manual Release Process
If you prefer to handle the release manually or need more control:

1. **Ensure clean git status**
   ```bash
   git status  # Should show no uncommitted changes
   ```

2. **Update version and changelog**
   ```bash
   # Edit package.json version manually
   # Edit CHANGELOG.md with release details
   ```

3. **Build and commit**
   ```bash
   npm run build
   git add .
   git commit -m "release: vX.X.X - Release description"
   ```

4. **Create and push tag**
   ```bash
   git tag -a vX.X.X -m "Release vX.X.X - Release description"
   git push origin master
   git push origin vX.X.X
   ```

5. **Create GitHub Release**
   - Go to [GitHub Releases](https://github.com/deweb-io/editorjs-image/releases)
   - Click "Create a new release"
   - Select the tag you just created
   - Add release notes (copy from CHANGELOG.md)
   - Publish the release

#### Release Script Features

The automated release script handles:

- ✅ **Git status validation** - Ensures no uncommitted changes
- ✅ **Version bumping** - Updates package.json with semantic versioning
- ✅ **Changelog generation** - Creates template entry in CHANGELOG.md
- ✅ **Project building** - Runs npm run build to generate distribution files
- ✅ **Git operations** - Commits changes, creates tags, pushes to origin
- ✅ **GitHub integration** - Opens release creation page automatically

#### Changelog Format

The project follows [Keep a Changelog](https://keepachangelog.com/) format. Each release entry should include:

```markdown
## [X.X.X] - YYYY-MM-DD

### Added
- New features or capabilities

### Changed  
- Changes to existing functionality

### Fixed
- Bug fixes and corrections

### Removed
- Deprecated or removed features
```

#### Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **Patch** (X.X.1) - Bug fixes, no new features, backward compatible
- **Minor** (X.1.X) - New features, backward compatible  
- **Major** (1.X.X) - Breaking changes, not backward compatible

#### Example Release Workflow

```bash
# 1. Make your changes and test thoroughly
git add .
git commit -m "fix: support image URLs with query parameters"

# 2. Run the release script
npm run release  # This creates v0.0.3 automatically

# 3. Edit the generated CHANGELOG.md entry with specific details
# 4. The script will open GitHub releases page for you to complete

# 5. Optionally publish to npm (if public package)
npm publish
```

#### Post-Release Checklist

After publishing a release:

- [ ] Verify the tag appears on GitHub
- [ ] Check that the release notes are complete  
- [ ] Update any documentation that references version numbers
- [ ] Announce the release (if applicable)
- [ ] Consider publishing to npm if it's a public package

### Development Setup

```bash
# Clone the repository
git clone https://github.com/deweb-io/editorjs-image.git
cd editorjs-image

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
npm run lint:fix
```

### Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature-name
3. Make your changes and test thoroughly
4. Follow the existing code style and patterns
5. Update documentation if needed
6. Submit a pull request with a clear description

For bug reports and feature requests, please use the [GitHub Issues](https://github.com/deweb-io/editorjs-image/issues) page.
