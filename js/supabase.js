/**
 * TeamMatch Supabase Client Integration
 * Provides cloud persistence with graceful offline/local fallback.
 */

export const SUPABASE_CONFIG = {
  url: "https://mfuxqkrqikilxchtadql.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mdXhxa3JxaWtpbHhjaHRhZHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODExOTYsImV4cCI6MjEwNjE1NzE5Nn0.A5HQwo3kJzKcqf3J3GAutvNL-JUCSfNIPJxYFVfK_Pc",
  publishableKey: "sb_publishable_KtEv4htIFBoLH2HY7mb3gw_NL_3FM6h"
};

/**
 * Fetch records from Supabase table
 * @param {string} table - Table name (students, internships, squads, conversations, resumes)
 * @param {string} query - Optional query string (e.g. "?order=created_at.desc")
 */
export async function fetchFromSupabase(table, query = '') {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}${query}`, {
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Supabase fetch failed for ${table}:`, err);
    return null;
  }
}

/**
 * Upsert records into Supabase table
 * @param {string} table - Table name
 * @param {object|array} record - Record or array of records to upsert
 */
export async function upsertToSupabase(table, record) {
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(record)
    });
    return res.ok;
  } catch (err) {
    console.warn(`Supabase upsert failed for ${table}:`, err);
    return false;
  }
}
