# Adding Project ID Support to Grant Form

## Issue Fixed

The grant database was returning an error when adding a single grant:

```
code: "23502"
message: "null value in column \"PROJECTID\" of relation \"grant\" violates not-null constraint"
details: "Failing row contains (null, 12446, 99020, SHEIKH AHMAD ZAKI BIN SHAIKH SALIM, RESOURCE DEVELOPMENT, TAKASAGO THERMAL, Automation using AI in finance, 2025-05-07, 2025-08-22, University Grant, Completed, University, RUG OF UTM, 1.22e+07)."
```

This error occurred because the `PROJECTID` column in the database has a NOT NULL constraint, but the form wasn't providing a value for this field.

## Changes Made

### 1. Updated the Grant Logic

In `hooks/grant-logic.tsx`:
- Modified the `addGrant` function to accept a `Partial<Grant>` instead of `Omit<Grant, 'PROJECTID'>`
- Added logic to automatically generate a unique PROJECTID if one isn't provided:
  ```typescript
  if (!newGrant.PROJECTID) {
      // Generate a unique PROJECTID if not provided
      newGrant.PROJECTID = `PRJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  ```

### 2. Enhanced the Grant Form

In `components/grant-crud-enhanced.tsx`:
- Added a PROJECTID field to the form
- Added a description explaining that the ID will be auto-generated if left blank
- Made the field disabled when editing existing grants to prevent ID changes

### 3. Updated the Grant DB Page

In `app/grant-db/page.tsx`:
- Modified the `handleAddGrant` function to pass the complete grant object to `addGrant`
- Removed the type casting that was excluding the PROJECTID field

## How It Works Now

1. When adding a new grant, users can optionally specify a PROJECTID
2. If no PROJECTID is provided, the system automatically generates one using the format `PRJ-[timestamp]-[random number]`
3. When editing existing grants, the PROJECTID field is displayed but disabled to prevent changes

## Technical Details

### Project ID Format

Auto-generated Project IDs follow this format:
- Prefix: `PRJ-`
- Timestamp: Current Unix timestamp (milliseconds since epoch)
- Random suffix: Random number between 0-999

Example: `PRJ-1716652387123-456`

### Implementation Notes

- The PROJECTID field is NOT marked as required in the form, as it will be auto-generated if empty
- We recommend allowing the system to generate IDs automatically for consistency
- The IDs are designed to be unique across the system
