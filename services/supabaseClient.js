import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function saveSignals(signals) {
  if (!signals.length) return;

  const { error } = await supabase
    .from("signals")
    .insert(signals);

  if (error) {
    console.log("Supabase error:", error.message);
  }
}
