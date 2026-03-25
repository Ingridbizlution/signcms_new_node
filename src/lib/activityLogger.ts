import { apiFetch } from "@/lib/apiClient";
import { readStoredAuth } from "@/lib/authStorage";

interface LogActivityParams {
  action: string;
  category: "auth" | "screen" | "media" | "schedule" | "publish" | "admin" | "studio";
  targetType?: string;
  targetId?: string;
  targetName?: string;
  detail?: string;
  orgId?: string | null;
}

let cachedIp: string | null = null;

async function getClientIp(): Promise<string> {
  if (cachedIp) return cachedIp;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    cachedIp = data.ip || "";
    return cachedIp;
  } catch {
    return "";
  }
}

export async function logActivity(params: LogActivityParams) {
  try {
    const auth = readStoredAuth();
    if (!auth?.token) return;
    const ip = await getClientIp();
    await apiFetch("/activity-logs", {
      method: "POST",
      body: JSON.stringify({
        action: params.action,
        category: params.category,
        targetType: params.targetType || "",
        targetId: params.targetId || "",
        targetName: params.targetName || "",
        detail: params.detail || "",
        orgId: params.orgId || null,
        ipAddress: ip,
      }),
    });
  } catch {
    // Silent fail - logging should never block user operations
  }
}
