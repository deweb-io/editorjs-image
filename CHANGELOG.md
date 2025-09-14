# Changelog

## [0.0.4] - 2025-09-14

### Added
- **closeOnActivate Configuration**: Added `closeOnActivate` option for tune configurations to control whether the tune menu closes automatically when a tune is activated
- **Automatic Menu Closing**: Link and Caption tunes now automatically close the tune menu when toggled for better user experience

### Changed
- **Tune Configuration Structure**: Enhanced tune configuration objects to support the new `closeOnActivate` property
- **Code Formatting**: Improved code formatting and structure in tune mapping for better readability

### Fixed
- **User Experience**: Improved tune menu behavior by automatically closing it when appropriate actions are performed


## [0.0.3] - 2025-09-14

### Added
- **Automated Release Script**: Added `scripts/release-simple.js` for streamlined publishing
- **Release NPM Scripts**: Added `npm run release`, `release:patch`, `release:minor`, `release:major` commands
- **Publishing Documentation**: Comprehensive guide in README.md for development and release process
- **Changelog Format**: Standardized changelog format following Keep a Changelog specification

### Changed
- **README.md**: Expanded with detailed publishing workflow and development setup instructions
- **Development Process**: Streamlined release process with automated version bumping and git operations

### Fixed
- **Release Workflow**: Automated git status validation, building, committing, and tagging process


## [0.0.2] - 2025-09-14

### Fixed
- **Image URL Recognition with Query Parameters**: Fixed regex pattern to properly recognize image URLs containing query parameters
  - Previously, URLs like `https://example.com/image.jpg?crop=4560,2565,x836,y799,safe&height=399&width=711&fit=bounds` were not recognized
  - Updated pattern from `(\?[a-z0-9=]*)?` to `(\?[^\s]*)?` to support:
    - Uppercase and lowercase letters
    - Special characters like `&`, `,`, `=`
    - Complex transformation parameters
  - Maintains backward compatibility with existing functionality
  - Proper rejection of non-image URLs is preserved

### Changed
- Improved URL pattern matching for better paste functionality support

## [0.0.1] - Initial Release
- Basic image tool functionality
- File upload support
- URL upload support
- Drag and drop support
