# Changelog

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
