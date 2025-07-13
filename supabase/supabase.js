import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = "https://dveshkxhhipwbtvcffno.supabase.co";
const supabaseKey = Constants.expoConfig.extra.supabaseAnonApiKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
