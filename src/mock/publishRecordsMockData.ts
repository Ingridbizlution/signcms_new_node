export interface MockPublishRecord {
  id: string;
  schedule_name: string;
  screen_name: string;
  status: string;
  scheduled_at: string | null;
  created_at: string;
}

export const mockPublishRecords: MockPublishRecord[] = [
  {
    id: "record-mock-001",
    schedule_name: "早班形象輪播",
    screen_name: "2-U1-C4-T",
    status: "playing",
    scheduled_at: null,
    created_at: "2026-03-28T06:10:00.000Z",
  },
  {
    id: "record-mock-002",
    schedule_name: "早班形象輪播",
    screen_name: "2-U1-S1-T",
    status: "playing",
    scheduled_at: null,
    created_at: "2026-03-28T06:10:00.000Z",
  },
  {
    id: "record-mock-003",
    schedule_name: "午間促銷輪播",
    screen_name: "2-U1-C2-T",
    status: "scheduled",
    scheduled_at: "2026-03-28T12:00:00.000Z",
    created_at: "2026-03-28T09:30:00.000Z",
  },
  {
    id: "record-mock-004",
    schedule_name: "午間促銷輪播",
    screen_name: "2-U1-W1-T",
    status: "scheduled",
    scheduled_at: "2026-03-28T12:00:00.000Z",
    created_at: "2026-03-28T09:30:00.000Z",
  },
  {
    id: "record-mock-005",
    schedule_name: "晚間活動公告",
    screen_name: "2-U1-N1-T",
    status: "playing",
    scheduled_at: null,
    created_at: "2026-03-27T18:05:00.000Z",
  },
  {
    id: "record-mock-006",
    schedule_name: "🚨 緊急廣播",
    screen_name: "2-U1-C4-T",
    status: "restored",
    scheduled_at: null,
    created_at: "2026-03-26T14:22:00.000Z",
  },
  {
    id: "record-mock-007",
    schedule_name: "假日特賣推播",
    screen_name: "2-U1-S2-T",
    status: "playing",
    scheduled_at: null,
    created_at: "2026-03-25T10:00:00.000Z",
  },
  {
    id: "record-mock-008",
    schedule_name: "假日特賣推播",
    screen_name: "2-U1-E1-T",
    status: "playing",
    scheduled_at: null,
    created_at: "2026-03-25T10:00:00.000Z",
  },
];
