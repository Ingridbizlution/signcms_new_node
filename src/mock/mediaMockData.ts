export type MediaType = "image" | "video" | "widget";

export interface MediaItemRow {
    id: string;
    name: string;
    type: MediaType;
    url: string;
    thumbnail?: string | null;
    size: string;
    dimensions: string;
    duration?: string | null;
    created_at: string;
    design_project_id?: string | null;
    is_system?: boolean;
}

export interface ProjectItem {
    id: string;
    name: string;
}

export const mockProjects: ProjectItem[] = [
    { id: "p1", name: "春季活動" },
    { id: "p2", name: "門市宣傳" },
    { id: "p3", name: "品牌形象" },
];

export const mockMedia: MediaItemRow[] = [
    {
        id: "m1",
        name: "春季主視覺.jpg",
        type: "image",
        url: "https://picsum.photos/1200/675?random=11",
        thumbnail: "https://picsum.photos/600/338?random=11",
        size: "2.3 MB",
        dimensions: "1920×1080",
        created_at: "2026-03-20T10:00:00",
        design_project_id: "p1",
        is_system: false,
    },
    {
        id: "m2",
        name: "門市活動海報.png",
        type: "image",
        url: "https://picsum.photos/1200/675?random=12",
        thumbnail: "https://picsum.photos/600/338?random=12",
        size: "1.8 MB",
        dimensions: "1080×1920",
        created_at: "2026-03-21T09:20:00",
        design_project_id: "p2",
        is_system: false,
    },
    {
        id: "m3",
        name: "品牌宣傳影片.mp4",
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: null,
        size: "15.0 MB",
        dimensions: "1920×1080",
        duration: "0:30",
        created_at: "2026-03-22T14:10:00",
        design_project_id: "p2",
        is_system: false,
    },
    {
        id: "m4",
        name: "新品上市影片.mp4",
        type: "video",
        url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        thumbnail: null,
        size: "9.6 MB",
        dimensions: "1280×720",
        duration: "0:12",
        created_at: "2026-03-22T18:45:00",
        design_project_id: "p3",
        is_system: false,
    },
    {
        id: "m5",
        name: "跑馬燈公告",
        type: "widget",
        url: 'widget://{"widgetType":"marquee","text":"歡迎光臨，春季優惠活動開跑！","speed":"normal","bgColor":"#1a1a2e","textColor":"#ffffff","fontSize":"medium","animation":"none"}',
        thumbnail: null,
        size: "-",
        dimensions: "auto",
        created_at: "2026-03-23T08:00:00",
        design_project_id: null,
        is_system: false,
    },
    {
        id: "m6",
        name: "系統時鐘元件",
        type: "widget",
        url: 'widget://{"widgetType":"clock","clockStyle":"digital","format":"24","showDate":true,"timezone":"Asia/Taipei","bgColor":"#0f172a","textColor":"#ffffff","fontSize":"large","animation":"none"}',
        thumbnail: null,
        size: "-",
        dimensions: "auto",
        created_at: "2026-03-23T09:00:00",
        design_project_id: "p3",
        is_system: true,
    },
];