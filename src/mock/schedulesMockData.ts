import { mockScreens } from "@/mock/screensMockData";

export type MockScheduleMode = "weekly" | "calendar";
export type MockPlaylistItemType = "media" | "design_project" | "widget";
export type MockPlaylistSubType = "image" | "video" | "design" | "widget";

export interface MockScheduleItem {
  id: string;
  media_id: string | null;
  design_project_id: string | null;
  item_type: MockPlaylistItemType;
  item_name: string;
  item_sub_type: MockPlaylistSubType;
  duration: number;
  sort_order: number;
}

export interface MockSchedule {
  id: string;
  name: string;
  org_id: string | null;
  screen_id: string;
  screen_label: string;
  start_time: string;
  end_time: string;
  days: string[];
  start_date: string | null;
  end_date: string | null;
  enabled: boolean;
  items: MockScheduleItem[];
}

function getScreenLabel(screenId: string): string {
  const matched = mockScreens.find((screen) => String(screen.id) === String(screenId));
  if (!matched) return "";
  const branch = matched.branch?.trim() || "未分館";
  const name = matched.name?.trim() || `螢幕 ${matched.id}`;
  return `${branch} - ${name}`;
}

export const mockSchedules: MockSchedule[] = [
  {
    id: "schedule-mock-001",
    name: "早班形象輪播",
    org_id: null,
    screen_id: "16",
    screen_label: getScreenLabel("16"),
    start_time: "06:00",
    end_time: "11:59",
    days: ["一", "二", "三", "四", "五"],
    start_date: null,
    end_date: null,
    enabled: true,
    items: [
      {
        id: "schedule-mock-001-item-001",
        media_id: "media-image-001",
        design_project_id: null,
        item_type: "media",
        item_name: "早安形象主視覺",
        item_sub_type: "image",
        duration: 10,
        sort_order: 0,
      },
      {
        id: "schedule-mock-001-item-002",
        media_id: "media-video-001",
        design_project_id: null,
        item_type: "media",
        item_name: "品牌形象短片 15s",
        item_sub_type: "video",
        duration: 15,
        sort_order: 1,
      },
      {
        id: "schedule-mock-001-item-003",
        media_id: "widget-weather-001",
        design_project_id: null,
        item_type: "widget",
        item_name: "今日天氣",
        item_sub_type: "widget",
        duration: 20,
        sort_order: 2,
      },
    ],
  },
  {
    id: "schedule-mock-002",
    name: "午晚餐促銷日曆排程",
    org_id: null,
    screen_id: "22",
    screen_label: getScreenLabel("22"),
    start_time: "11:00",
    end_time: "20:30",
    days: [],
    start_date: "2026-04-01",
    end_date: "2026-04-30",
    enabled: true,
    items: [
      {
        id: "schedule-mock-002-item-001",
        media_id: "media-image-010",
        design_project_id: null,
        item_type: "media",
        item_name: "午餐套餐促銷",
        item_sub_type: "image",
        duration: 12,
        sort_order: 0,
      },
      {
        id: "schedule-mock-002-item-002",
        media_id: null,
        design_project_id: "design-project-001",
        item_type: "design_project",
        item_name: "四月活動畫布",
        item_sub_type: "design",
        duration: 15,
        sort_order: 1,
      },
      {
        id: "schedule-mock-002-item-003",
        media_id: "widget-clock-001",
        design_project_id: null,
        item_type: "widget",
        item_name: "電子時鐘",
        item_sub_type: "widget",
        duration: 15,
        sort_order: 2,
      },
    ],
  },
  {
    id: "schedule-mock-003",
    name: "週末活動預告",
    org_id: null,
    screen_id: "98",
    screen_label: getScreenLabel("98"),
    start_time: "09:00",
    end_time: "22:00",
    days: ["六", "日"],
    start_date: null,
    end_date: null,
    enabled: false,
    items: [
      {
        id: "schedule-mock-003-item-001",
        media_id: "media-video-021",
        design_project_id: null,
        item_type: "media",
        item_name: "週末舞台活動預告",
        item_sub_type: "video",
        duration: 30,
        sort_order: 0,
      },
      {
        id: "schedule-mock-003-item-002",
        media_id: "media-image-022",
        design_project_id: null,
        item_type: "media",
        item_name: "交通導覽圖卡",
        item_sub_type: "image",
        duration: 10,
        sort_order: 1,
      },
    ],
  },
];
