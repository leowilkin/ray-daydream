import Airtable from "airtable";
import { Action, ActionPanel, getPreferenceValues, Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";

type DaydreamEvent = {
  id: string;
  fields: {
    location?: string;
    slug?: string;
    triage_status?: string;
  };
};

type Preferences = {
  airtablePat: string;
  baseId: string;
  tableId: string;
};

const preferences: Preferences = getPreferenceValues();

// Configure Airtable
Airtable.configure({
  apiKey: preferences.airtablePat,
});

const base = Airtable.base(preferences.baseId);

async function fetchDaydreamEvents(): Promise<DaydreamEvent[]> {
  const events: DaydreamEvent[] = [];
  
  // Require tableId to be provided - this is necessary for proper authorization
  if (!preferences.tableId) {
    throw new Error("Table ID is required. Please provide the table ID in preferences.");
  }
  
  const table = base(preferences.tableId);
  
  return new Promise((resolve, reject) => {
    table
      .select({
        filterByFormula: "{triage_status} = 'Approved'",
        fields: ["location", "slug", "triage_status"],
        // Optimize for speed - get all records in fewer requests
        pageSize: 100,
        // Sort by location for consistent ordering
        sort: [{ field: "location", direction: "asc" }],
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => {
            events.push({
              id: record.id,
              fields: record.fields as DaydreamEvent["fields"],
            });
          });
          fetchNextPage();
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(events);
          }
        }
      );
  });
}

export default function Command() {
  const { data, isLoading, error, revalidate } = useCachedPromise(
    fetchDaydreamEvents,
    [],
    {
      // Cache for 5 minutes to speed up subsequent loads
      keepPreviousData: true,
      initialData: [],
    }
  );

  if (error) {
    return (
      <List>
        <List.Item
          title="Error loading events"
          subtitle={error.message}
          icon={Icon.ExclamationMark}
          actions={
            <ActionPanel>
              <Action
                title="Retry"
                icon={Icon.ArrowClockwise}
                onAction={revalidate}
                shortcut={{ modifiers: ["cmd"], key: "r" }}
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List 
      isLoading={isLoading} 
      searchBarPlaceholder="Search Daydream events..."
      actions={
        <ActionPanel>
          <Action
            title="Refresh Events"
            icon={Icon.ArrowClockwise}
            onAction={revalidate}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
          />
        </ActionPanel>
      }
    >
      {/* Special Daydream main page item */}
      <List.Item
        key="daydream-main"
        icon={Icon.Star}
        title="Daydream"
        subtitle="Main Daydream page on HCB"
        accessories={[
          {
            icon: Icon.Globe,
            text: "Main Page",
            tooltip: "Go to main Daydream page",
          },
        ]}
        actions={
          <ActionPanel>
            <Action.OpenInBrowser 
              title="Open Daydream Main Page" 
              url="https://hcb.hackclub.com/daydream" 
              icon={Icon.Globe}
            />
            <ActionPanel.Section>
              <Action
                title="Refresh Events"
                icon={Icon.ArrowClockwise}
                onAction={revalidate}
                shortcut={{ modifiers: ["cmd"], key: "r" }}
              />
            </ActionPanel.Section>
            <ActionPanel.Section>
              <Action.CopyToClipboard
                title="Copy Main Page URL"
                content="https://hcb.hackclub.com/daydream"
                shortcut={{ modifiers: ["cmd"], key: "." }}
              />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
      
      {/* Separator */}
      <List.Section title="Events">
      {data?.map((event) => {
        const location = event.fields.location || "Unknown Location";
        const slug = event.fields.slug;
        const hcbUrl = slug ? `https://hcb.hackclub.com/daydream-${slug}` : undefined;

        return (
          <List.Item
            key={event.id}
            icon={Icon.Calendar}
            title={location}
            subtitle={slug ? `Slug: ${slug}` : "No slug available"}
            accessories={[
              {
                icon: Icon.CheckCircle,
                text: "Approved",
                tooltip: "Triage Status: Approved",
              },
            ]}
            actions={
              <ActionPanel>
                {hcbUrl && (
                  <Action.OpenInBrowser 
                    title="Open on HCB" 
                    url={hcbUrl} 
                    icon={Icon.Globe}
                  />
                )}
                <ActionPanel.Section>
                  <Action
                    title="Refresh Events"
                    icon={Icon.ArrowClockwise}
                    onAction={revalidate}
                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                  />
                </ActionPanel.Section>
                <ActionPanel.Section>
                  <Action.CopyToClipboard
                    title="Copy Event Name"
                    content={location}
                    shortcut={{ modifiers: ["cmd"], key: "." }}
                  />
                  {slug && (
                    <Action.CopyToClipboard
                      title="Copy Slug"
                      content={slug}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "." }}
                    />
                  )}
                  {hcbUrl && (
                    <Action.CopyToClipboard
                      title="Copy HCB URL"
                      content={hcbUrl}
                      shortcut={{ modifiers: ["cmd", "opt"], key: "." }}
                    />
                  )}
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        );
      })}
      {data && data.length === 0 && !isLoading && (
        <List.Item
          title="No approved events found"
          subtitle="Make sure your Airtable base contains approved Daydream events"
          icon={Icon.Info}
        />
      )}
      </List.Section>
    </List>
  );
}
