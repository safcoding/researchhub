# Single Grant Entry Form Enhancement

## Overview

This document outlines the enhancements made to the single grant entry form in the ResearchHub Grants Database. The form has been redesigned to improve user experience, data validation, and provide more guidance during the grant information entry process.

## Key Enhancements

### 1. Form Validation

- **Required Fields**: Clearly marked required fields with asterisks (*)
- **Client-side Validation**: Added validation before submission to prevent errors
- **Field-specific Validation**:
  - Date validation to ensure end date is after start date
  - Amount validation to ensure positive values
  - Required field validation with clear error messages

### 2. Improved User Interface

- **Field Categorization**: Grouped related fields together
- **Tooltips and Descriptions**: Added descriptions for fields to provide guidance
- **Visual Feedback**: 
  - Success messages after successful submission
  - Error highlighting for invalid fields
  - Loading indicators during submission

### 3. Enhanced Grant Type Selection

- **Standardized Options**: Provided a dropdown with standardized grant type options:
  - University Grant
  - Government Grant
  - Industrial Grant
  - International Grant
  - Research Contract
  - Consulting
  - Donation
  - Endowment
  - Fellowship
  - Scholarship
  - Other

### 4. Sponsor Category Standardization

- Added dropdown for sponsor categories to ensure consistent data:
  - Government
  - University
  - Industry
  - Non-Profit
  - International
  - Other

### 5. Form State Management

- **Form Reset**: Clears form after successful submission of a new grant
- **Error Persistence**: Maintains error state until fields are corrected
- **Touch Tracking**: Tracks which fields have been touched to only show errors after interaction

## How to Use

### Adding a New Grant

1. Click the "Add Single Grant" button on the Grants Database page
2. Fill in all required fields (marked with *)
3. Select appropriate options from dropdowns where available
4. Click "Save Grant" to submit the form
5. If successful, you'll see a success message and the form will reset for another entry
6. If there are validation errors, they will be highlighted in red

### Editing an Existing Grant

1. Click the "Edit" button next to any grant in the grants table
2. The form will be pre-populated with the grant's current information
3. Make your changes to any fields
4. Click "Save Grant" to update the information
5. If successful, you'll see a success message and be returned to the grants table

## Field Descriptions

| Field | Description | Required |
|-------|-------------|----------|
| Project Title | Official title of the research project | Yes |
| PI Name | Full name of the principal investigator | Yes |
| PI Staff Number | Staff identification number of the PI | No |
| Start Date | Date when the project officially begins | Yes |
| End Date | Expected completion date of the project | Yes |
| Grant Type | Category or type of funding for this grant | Yes |
| Project Status | Current status of the project | Yes |
| Research Alliance | Research alliance or department associated with this grant | No |
| Research Group | Specific research group working on this project | No |
| Cost Center Code | The financial cost center code associated with this grant | No |
| Approved Amount | Total approved amount for this grant in MYR | Yes |
| Sponsor Category | General category of the sponsoring organization | No |
| Subsponsor Name | Specific name of the sponsoring organization | No |

## Technical Implementation

The enhanced form component:
- Uses React hooks for state management
- Implements form validation logic
- Provides responsive design for different screen sizes
- Uses Tailwind CSS for styling
- Shows loading indicators during API calls
