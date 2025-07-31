# Daydream Events

A Raycast extension to search through approved Daydream events in Airtable and quickly open them on HCB (Hack Club Bank).

## Feature

- **Fast caching**: Events are cached to speed up subsequent loads and reduce API calls
- **Smart refresh**: Use Cmd+R to force reload fresh data from Airtable
- **Optimized fetching**: Larger page sizes and sorted results for better performance
- Search through approved Daydream events from your Airtable base
- Filter events by triage status (only shows "Approved" events)
- Quick access to open events on HCB using the format: `https://hcb.hackclub.com/daydream-{slug}`
- Copy event names, slugs, or HCB URLs to clipboard

## Setup

1. Get your Airtable Personal Access Token from [Airtable Account](https://airtable.com/account)
2. Find your Airtable Base ID from the URL when viewing your base (e.g., `appXXXXXXXXXXXXX`)
3. Get your Table ID:
   - **Method 1**: Use the table name as it appears in Airtable (e.g., "Daydream Events")
   - **Method 2**: Get the table ID from the URL when viewing the table (e.g., `tblXXXXXXXXXXXXX`)
   - **Method 3**: Use Airtable API documentation to find the table ID

## Configuration

The extension requires the following preferences:

- **Airtable Personal Access Token**: Your Airtable PAT for API access
- **Base ID**: The ID of your Airtable base containing the Daydream events (starts with `app`)
- **Table ID**: The ID or name of your table (required for proper authorization)

## Expected Airtable Schema

The extension expects your Airtable table to have the following fields:

- `location` - The nicely formatted name of the event
- `slug` - The slug used to construct the HCB URL
- `triage_status` - Must be set to "Approved" for events to appear

## Usage

1. Open Raycast
2. Type "Search Daydream Events" or use the configured shortcut
3. Search through the approved events
4. Press Enter to open the event on HCB, or use the action panel for more options
5. Use **Cmd+R** to refresh/reload events from Airtable when needed