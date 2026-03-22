import { supabase } from "@/integrations/supabase/client";

interface LogActivityParams {
  action: string;
  category: "auth" | "screen" | "media" | "schedule" | "publish" | "admin" | "studio";
  targetType?: string;
  targetId?: string;
  targetName?: string;
  detail?: string;
  orgId?: string | null;
}

export async function logActivity(params: LogActivityParams) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await (supabase as any).from("activity_logs").insert({
      user_id: user.id,
      action: params.action,
      category: params.category,
      target_type: params.targetType || "",
      target_id: params.targetId || "",
      target_name: params.targetName || "",
      detail: params.detail || "",
      org_id: params.orgId || null,
    });
  } catch {
    // Silent fail - logging should never block user operations
  }
}
