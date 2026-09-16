import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getGameStats(gameSlug: string) {
  try {
    const { count, error } = await supabase
      .from("game_waitlist")
      .select("*", { count: "exact", head: true })
      .eq("game_slug", gameSlug);

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error("Failed to fetch game stats:", err);
    return 0;
  }
}

export async function registerForGameBeta(gameSlug: string, rawEmail: string) {
  const email = rawEmail.trim().toLowerCase();
  
  const { data, error } = await supabase
    .from("game_waitlist")
    .insert([{ game_slug: gameSlug, email, has_upvoted: true }])
    .select();

  if (error) {
    // 23505 is PostgreSQL unique constraint violation error code
    if (error.code === "23505") {
      return { success: false, reason: "already_voted" };
    }
    return { success: false, reason: "error", error };
  }

  return { success: true, data };
}