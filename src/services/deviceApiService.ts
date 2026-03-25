/**
 * deviceApiService.ts
 * 封裝對 /signcms_api_dev/device* 的 REST API 呼叫。
 * 使用 cookie 中的 csrf_access_token 做 CSRF 驗證（沿用 old_cms 機制）。
 */

const API_BASE = '/signcms_api_dev';

// ─── old CMS 原始型別 ─────────────────────────────────────────────────────────

export interface OldDeviceGroup {
  id: number;
  name: string;
}

export interface OldDevice {
  id: number;
  name: string;
  model?: string;
  serial_number?: string;
  asset_number?: string;
  mac_wifi?: string;
  mac_ethernet?: string;
  description?: string;
  device_group_id?: number | null;
  ip?: string;
  area?: string;
  floor?: string;
  position?: string;
  kiosk_id?: number;
  remote_id?: string;
  category?: string;
  status?: number;  // 0=unknown, 1=disconnected, 2=online, 3=kiosk_online, 4=player_nochannel
  channel?: string;
  connect_date?: string;
  location?: string;
  info?: string;
}

// ─── 新 UI 使用的 Screen 型別（與 ScreensPage.tsx 的 interface 保持一致）─────

export interface Screen {
  id: string;
  name: string;
  branch: string;
  location: string;
  resolution: string;
  online: boolean;
  org_id?: string | null;
  serial_number?: string;
  ip_address?: string;
  connection_type?: string;
  avg_upload_speed?: string;
  avg_download_speed?: string;
  firmware_version?: string;
}

// ─── 新增/更新裝置用的 payload 型別 ──────────────────────────────────────────

export interface DevicePayload {
  name: string;
  location?: string;
  model?: string;         // 對應新 UI 的 resolution 欄位
  serial_number?: string;
  ip?: string;            // 對應新 UI 的 ip_address 欄位
  device_group_id?: number | null;
}

// ─── 內部工具函式 ──────────────────────────────────────────────────────────────

function getCsrfToken(): string {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrf_access_token='));
  return match ? decodeURIComponent(match.split('=')[1]) : '';
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-CSRF-TOKEN': getCsrfToken(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  return res;
}

// ─── 資料轉換：old Device → new Screen ────────────────────────────────────────

function mapDeviceToScreen(device: OldDevice, groups: OldDeviceGroup[]): Screen {
  const group = groups.find((g) => g.id === device.device_group_id);

  // status === 2 視為 online，其餘皆為 offline
  const online = device.status === 2;

  // 若 location 有值直接用；否則合併 area / floor / position
  const location =
    device.location ||
    [device.area, device.floor, device.position].filter(Boolean).join(' ') ||
    '';

  return {
    id: String(device.id),
    name: device.name || '',
    branch: group?.name || '',
    location,
    resolution: device.model || '',   // old model → new resolution 欄位暫代
    online,
    org_id: null,
    serial_number: device.serial_number || '',
    ip_address: device.ip || '',
    connection_type: 'wired',          // old API 無此欄位，預設 wired
    avg_upload_speed: '',
    avg_download_speed: '',
    firmware_version: '',
  };
}

// ─── 公開 API 函式 ─────────────────────────────────────────────────────────────

/** 取得所有裝置群組 */
export async function fetchDeviceGroups(): Promise<OldDeviceGroup[]> {
  const res = await apiFetch('/device_group');
  return res.json();
}

/**
 * 同時取得裝置列表 + 群組列表，並回傳轉換後的 Screen 陣列。
 * 呼叫兩支 API：GET /device 與 GET /device_group。
 */
export async function fetchDevicesWithGroups(): Promise<{
  screens: Screen[];
  groups: OldDeviceGroup[];
}> {
  const [devRes, groups] = await Promise.all([
    apiFetch('/device'),
    fetchDeviceGroups(),
  ]);
  const devices: OldDevice[] = await devRes.json();
  const screens = devices.map((d) => mapDeviceToScreen(d, groups));
  return { screens, groups };
}

/** 新增裝置 */
export async function createDevice(payload: DevicePayload): Promise<void> {
  await apiFetch('/device', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** 更新裝置（PATCH） */
export async function updateDevice(id: string, payload: DevicePayload): Promise<void> {
  await apiFetch(`/device/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/** 刪除裝置 */
export async function deleteDevice(id: string): Promise<void> {
  await apiFetch(`/device/${id}`, {
    method: 'DELETE',
  });
}
