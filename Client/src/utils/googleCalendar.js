// // src/utils/googleCalendar.js
// import { gapi } from "gapi-script";

// const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// const API_KEY = import.meta.env.VITE_API_KEY;
// const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// const SCOPES = "https://www.googleapis.com/auth/calendar";

// export async function initGoogleApi() {
//   return new Promise((resolve, reject) => {
//     try {
//       gapi.load("client:auth2", async () => {
//         try {
//           await gapi.client.init({
//             apiKey: API_KEY,
//             clientId: CLIENT_ID,
//             discoveryDocs: DISCOVERY_DOCS,
//             scope: SCOPES,
//           });
//           resolve(gapi.auth2.getAuthInstance());
//         } catch (err) {
//           reject(err);
//         }
//       });
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// export function isSignedIn() {
//   try {
//     const auth = gapi.auth2.getAuthInstance();
//     return auth?.isSignedIn?.get();
//   } catch {
//     return false;
//   }
// }

// export async function signIn() {
//   const auth = gapi.auth2.getAuthInstance();
//   if (!auth) throw new Error("Google API not initialized");
//   if (!auth.isSignedIn.get()) {
//     await auth.signIn();
//   }
//   return auth.currentUser.get();
// }

// export function signOut() {
//   try {
//     const auth = gapi.auth2.getAuthInstance();
//     if (auth && auth.isSignedIn.get()) auth.signOut();
//   } catch (err) {
//     console.warn("Sign out failed", err);
//   }
// }

// /**
//  * Ensure a calendar named "Travel Planner" exists for the signed-in user.
//  * If it exists (by exact summary), returns the calendarId.
//  * Otherwise creates it and returns new calendarId.
//  */
// export async function ensureTravelPlannerCalendar() {
//   // try localStorage first
//   const cached = localStorage.getItem("travelCalendarId");
//   if (cached) {
//     // verify it exists
//     try {
//       const resp = await gapi.client.calendar.calendars.get({ calendarId: cached });
//       if (resp && resp.result && resp.result.id) return resp.result.id;
//       // else fallthrough to create
//     } catch (err) {
//       // ignore and recreate
//       console.info("Cached travel calendar not valid, will recreate");
//     }
//   }

//   // List user's calendars and see if Travel Planner already exists
//   const listResp = await gapi.client.calendar.calendarList.list();
//   const items = listResp.result.items || [];
//   const existing = items.find((c) => c.summary === "Travel Planner");
//   if (existing) {
//     localStorage.setItem("travelCalendarId", existing.id);
//     return existing.id;
//   }

//   // Create a new calendar
//   const createResp = await gapi.client.calendar.calendars.insert({
//     resource: {
//       summary: "Travel Planner",
//       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
//     },
//   });
//   const created = createResp.result;
//   if (created && created.id) {
//     // Add to calendarList (usually automatic)
//     localStorage.setItem("travelCalendarId", created.id);
//     return created.id;
//   }
//   throw new Error("Failed to create Travel Planner calendar");
// }

// /**
//  * Insert an event into calendarId
//  * eventResource should follow Google Calendar Events resource shape
//  */
// export async function insertEvent(calendarId, eventResource) {
//   return gapi.client.calendar.events.insert({
//     calendarId,
//     resource: eventResource,
//     sendUpdates: "none", // change if you add attendees and want notifications
//   });
// }


// src/utils/googleCalendar.js
//import { google } from "googleapis"; // optional if backend uses Node
// frontend mostly uses fetch to Google Calendar API with token

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

/**
 * Ensure Travel Planner calendar exists
 */
export async function ensureTravelPlannerCalendar() {
  if (!accessToken) throw new Error("No access token set");

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  // List calendars
  const listRes = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", { headers });
  const listData = await listRes.json();
  const existing = (listData.items || []).find(c => c.summary === "Travel Planner");
  if (existing) return existing.id;

  // Create new calendar
  const createRes = await fetch("https://www.googleapis.com/calendar/v3/calendars", {
    method: "POST",
    headers,
    body: JSON.stringify({
      summary: "Travel Planner",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    }),
  });
  const created = await createRes.json();
  if (created.id) return created.id;

  throw new Error("Failed to create Travel Planner calendar");
}

/**
 * Insert event into a calendar
 */
export async function insertEvent(calendarId, eventResource) {
  if (!accessToken) throw new Error("No access token set");
  return fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventResource),
  }).then(res => res.json());
}
