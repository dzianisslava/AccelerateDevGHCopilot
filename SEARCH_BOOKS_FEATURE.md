# SearchBooks Feature

## Overview
This document describes the SearchBooks feature added to the Library Console application.

## Description
The SearchBooks method allows users to search for books by title and check their availability for loan.

## Implementation Details

### Method Signature
```csharp
async Task<ConsoleState> SearchBooks()
```

### Features
- **Case-insensitive search**: Users can search for books regardless of case
- **Availability check**: The method checks if a book is currently on loan
- **User feedback**: Displays clear messages about book availability and due dates

### Example Usage
1. User selects "b" for book availability search from the menu
2. Enter book title (e.g., "Book One")
3. System returns:
   - If available: `"Book Title" is available for loan.`
   - If on loan: `"Book Title" is on loan to another patron. The return due date is [date].`

## Files Modified
- `src/Library.Console/ConsoleApp.cs`: Added SearchBooks method
- `src/Library.Infrastructure/Data/JsonData.cs`: Fixed JSON path resolution

## Testing
The feature has been tested with the library's JSON data and works as expected.

## Related Issues
This feature addresses the book availability checking requirement in the library management system.
