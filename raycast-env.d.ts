/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Airtable Personal Access Token - Your Airtable Personal Access Token */
  "airtablePat": string,
  /** Base ID - The ID of your Airtable base */
  "baseId": string,
  /** Table ID - The ID or name of your table (e.g., 'tblXXXXXXXX' or 'Table Name') */
  "tableId": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-events` command */
  export type SearchEvents = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `search-events` command */
  export type SearchEvents = {}
}

