//version
// import { useState, useEffect, useMemo } from "react";
// import { useUserRole } from "@/hooks/useUserRole";
// import { useUserOrgs } from "@/hooks/useUserOrgs";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/integrations/supabase/client";
// import {
//   CalendarClock, Plus, Pencil, Trash2, GripVertical, ChevronUp, ChevronDown,
//   Play, Clock, Monitor, FileImage, FileVideo, X, Loader2, Layers, Code2, Building2,
// } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
//   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";
// import { logActivity } from "@/lib/activityLogger";

// type PlaylistItemType = "media" | "design_project" | "widget";

// interface PlaylistItem {
//   id: string;
//   media_id: string | null;
//   design_project_id: string | null;
//   item_type: PlaylistItemType;
//   item_name: string;
//   item_sub_type: "image" | "video" | "design" | "widget";
//   duration: number;
//   sort_order: number;
// }

// interface Schedule {
//   id: string;
//   name: string;
//   org_id: string | null;
//   screen_id: string;
//   screen_label: string;
//   start_time: string;
//   end_time: string;
//   days: string[];
//   enabled: boolean;
//   items: PlaylistItem[];
// }

// interface ScreenOption { id: string; label: string; }
// interface MediaOption { id: string; name: string; type: "image" | "video" | "widget"; }
// interface DesignProjectOption { id: string; name: string; aspect: string; }
// interface WidgetOption { id: string; name: string; }

// interface FormPlaylistItem {
//   tempId: number;
//   media_id: string | null;
//   design_project_id: string | null;
//   item_type: PlaylistItemType;
//   item_name: string;
//   item_sub_type: "image" | "video" | "design" | "widget";
//   duration: number;
// }

// function ItemIcon({ subType }: { subType: "image" | "video" | "design" | "widget" }) {
//   if (subType === "design") return <Layers className="w-4 h-4 text-primary shrink-0" />;
//   if (subType === "widget") return <Code2 className="w-4 h-4 text-accent-foreground shrink-0" />;
//   if (subType === "video") return <FileVideo className="w-4 h-4 text-muted-foreground shrink-0" />;
//   return <FileImage className="w-4 h-4 text-muted-foreground shrink-0" />;
// }

// function SmallItemIcon({ subType }: { subType: "image" | "video" | "design" | "widget" }) {
//   if (subType === "design") return <Layers className="w-3.5 h-3.5 text-primary shrink-0" />;
//   if (subType === "widget") return <Code2 className="w-3.5 h-3.5 text-accent-foreground shrink-0" />;
//   if (subType === "video") return <FileVideo className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
//   return <FileImage className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
// }

// export default function SchedulesPage() {
//   const { isAdmin } = useUserRole();
//   const { t, language } = useLanguage();
//   const { user } = useAuth();
//   const { orgs, defaultOrgId } = useUserOrgs();
//   const [schedules, setSchedules] = useState<Schedule[]>([]);
//   const [screenOptions, setScreenOptions] = useState<ScreenOption[]>([]);
//   const [mediaOptions, setMediaOptions] = useState<MediaOption[]>([]);
//   const [widgetOptions, setWidgetOptions] = useState<WidgetOption[]>([]);
//   const [designOptions, setDesignOptions] = useState<DesignProjectOption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [dragIndex, setDragIndex] = useState<number | null>(null);
//   const [filterOrgId, setFilterOrgId] = useState<string>("all");

//   const [form, setForm] = useState({
//     name: "", screen_id: "", startTime: "09:00", endTime: "18:00",
//     days: ["一", "二", "三", "四", "五"] as string[],
//     items: [] as FormPlaylistItem[],
//   });

//   const dayKeys = ["dayMon", "dayTue", "dayWed", "dayThu", "dayFri", "daySat", "daySun"] as const;
//   const allDaysRaw = ["一", "二", "三", "四", "五", "六", "日"];
//   const dayLabels = dayKeys.map((k) => t(k));

//   const fetchAll = async () => {
//     setLoading(true);

//     const { data: screensData } = await (supabase as any).from("screens").select("id, name, branch").order("branch");
//     const opts: ScreenOption[] = (screensData || []).map((s: any) => ({ id: s.id, label: `${s.branch} - ${s.name}` }));
//     setScreenOptions(opts);

//     const { data: mediaData } = await (supabase as any).from("media_items").select("id, name, type").order("created_at", { ascending: false });
//     const allMedia = mediaData || [];
//     setMediaOptions(allMedia.filter((m: any) => m.type !== "widget"));
//     setWidgetOptions(allMedia.filter((m: any) => m.type === "widget"));

//     const { data: designData } = await (supabase as any).from("design_projects").select("id, name, aspect").order("updated_at", { ascending: false });
//     setDesignOptions(designData || []);

//     const { data: schedData } = await (supabase as any).from("schedules").select("*").order("created_at");

//     const { data: itemsData } = await (supabase as any).from("schedule_items")
//       .select("id, schedule_id, media_id, design_project_id, item_type, sort_order, duration")
//       .order("sort_order");

//     const mediaMap = new Map(allMedia.map((m: any) => [m.id, m]));
//     const designMap = new Map((designData || []).map((d: any) => [d.id, d]));
//     const screenMap = new Map(opts.map((s) => [s.id, s.label]));

//     const merged: Schedule[] = (schedData || []).map((s: any) => {
//       const schedItems: PlaylistItem[] = (itemsData || [])
//         .filter((i: any) => i.schedule_id === s.id)
//         .map((i: any) => {
//           if (i.item_type === "design_project") {
//             const d = designMap.get(i.design_project_id) as any;
//             return {
//               id: i.id, media_id: null, design_project_id: i.design_project_id,
//               item_type: "design_project" as PlaylistItemType,
//               item_name: d?.name || "Unknown", item_sub_type: "design" as const,
//               duration: i.duration, sort_order: i.sort_order,
//             };
//           }
//           const m = mediaMap.get(i.media_id) as any;
//           const isWidget = m?.type === "widget";
//           return {
//             id: i.id, media_id: i.media_id, design_project_id: null,
//             item_type: (isWidget ? "widget" : "media") as PlaylistItemType,
//             item_name: m?.name || "Unknown", item_sub_type: (isWidget ? "widget" : (m?.type || "image")) as "image" | "video" | "widget",
//             duration: i.duration, sort_order: i.sort_order,
//           };
//         });
//       return {
//         id: s.id, name: s.name, org_id: s.org_id || null, screen_id: s.screen_id,
//         screen_label: screenMap.get(s.screen_id) || "",
//         start_time: s.start_time, end_time: s.end_time,
//         days: s.days || [], enabled: s.enabled, items: schedItems,
//       };
//     });

//     setSchedules(merged);
//     setLoading(false);
//   };

//   useEffect(() => { fetchAll(); }, []);

//   const filteredSchedules = useMemo(() => {
//     if (filterOrgId === "all") return schedules;
//     if (filterOrgId === "none") return schedules.filter(s => !s.org_id);
//     return schedules.filter(s => s.org_id === filterOrgId);
//   }, [schedules, filterOrgId]);

//   const openAdd = () => {
//     setEditingId(null);
//     setForm({ name: "", screen_id: "", startTime: "09:00", endTime: "18:00", days: ["一", "二", "三", "四", "五"], items: [] });
//     setDialogOpen(true);
//   };

//   const openEdit = (s: Schedule) => {
//     setEditingId(s.id);
//     setForm({
//       name: s.name, screen_id: s.screen_id, startTime: s.start_time, endTime: s.end_time,
//       days: [...s.days],
//       items: s.items.map((i) => ({
//         tempId: Math.random(), media_id: i.media_id, design_project_id: i.design_project_id,
//         item_type: i.item_type, item_name: i.item_name, item_sub_type: i.item_sub_type, duration: i.duration,
//       })),
//     });
//     setDialogOpen(true);
//   };

//   const handleSave = async () => {
//     if (!form.name || !form.screen_id) { toast.error(t("schedFillRequired")); return; }
//     if (form.items.length === 0) { toast.error(t("schedAddItem")); return; }
//     setSaving(true);

//     if (editingId) {
//       await (supabase as any).from("schedules").update({
//         name: form.name, screen_id: form.screen_id, start_time: form.startTime,
//         end_time: form.endTime, days: form.days, updated_at: new Date().toISOString(),
//       }).eq("id", editingId);

//       await (supabase as any).from("schedule_items").delete().eq("schedule_id", editingId);
//       const items = form.items.map((item, i) => ({
//         schedule_id: editingId, media_id: item.media_id, design_project_id: item.design_project_id,
//         item_type: item.item_type === "widget" ? "media" : item.item_type, sort_order: i, duration: item.duration,
//       }));
//       await (supabase as any).from("schedule_items").insert(items);
//       toast.success(t("schedUpdated"));
//       logActivity({ action: "編輯排程", category: "schedule", targetName: form.name, targetId: editingId! });
//     } else {
//       const { data: newSched, error } = await (supabase as any).from("schedules").insert({
//         name: form.name, screen_id: form.screen_id, start_time: form.startTime,
//         end_time: form.endTime, days: form.days, created_by: user?.id,
//         org_id: defaultOrgId,
//       }).select("id").single();

//       if (error) { toast.error(error.message); setSaving(false); return; }

//       const items = form.items.map((item, i) => ({
//         schedule_id: newSched.id, media_id: item.media_id, design_project_id: item.design_project_id,
//         item_type: item.item_type === "widget" ? "media" : item.item_type, sort_order: i, duration: item.duration,
//       }));
//       await (supabase as any).from("schedule_items").insert(items);
//       toast.success(t("schedAdded"));
//       logActivity({ action: "新增排程", category: "schedule", targetName: form.name });
//     }

//     setSaving(false);
//     setDialogOpen(false);
//     fetchAll();
//   };

//   const handleDelete = async () => {
//     if (deleteId) {
//       const { error } = await (supabase as any).from("schedules").delete().eq("id", deleteId);
//       if (error) toast.error(error.message);
//       else {
//         const deleted = schedules.find(s => s.id === deleteId);
//         toast.success(t("schedDeleted"));
//         logActivity({ action: "刪除排程", category: "schedule", targetName: deleted?.name || "", targetId: deleteId });
//         fetchAll();
//       }
//       setDeleteId(null);
//     }
//   };

//   const toggleEnabled = async (id: string, current: boolean) => {
//     await (supabase as any).from("schedules").update({ enabled: !current }).eq("id", id);
//     fetchAll();
//   };

//   const addMediaToForm = (media: MediaOption) => {
//     const item: FormPlaylistItem = {
//       tempId: Date.now() + Math.random(), media_id: media.id, design_project_id: null,
//       item_type: "media", item_name: media.name, item_sub_type: media.type,
//       duration: media.type === "video" ? 30 : 10,
//     };
//     setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
//   };

//   const addDesignToForm = async (dp: DesignProjectOption) => {
//     let loopDuration = 15;
//     try {
//       const { data } = await (supabase as any).from("design_projects").select("zones").eq("id", dp.id).single();
//       if (data?.zones && Array.isArray(data.zones)) {
//         // Each zone may have mediaItems with individual durations.
//         // A single loop = the max zone duration (each zone plays its carousel independently).
//         // Zone duration = sum of all its media item durations.
//         const zoneDurations = (data.zones as any[]).map((zone: any) => {
//           const items = zone.content?.mediaItems;
//           if (!Array.isArray(items) || items.length === 0) return 0;
//           return items.reduce((sum: number, m: any) => sum + (m.duration || 5), 0);
//         });
//         const maxDur = Math.max(...zoneDurations, 0);
//         if (maxDur > 0) loopDuration = Math.round(maxDur);
//       }
//     } catch {}
//     const item: FormPlaylistItem = {
//       tempId: Date.now() + Math.random(), media_id: null, design_project_id: dp.id,
//       item_type: "design_project", item_name: dp.name, item_sub_type: "design",
//       duration: loopDuration,
//     };
//     setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
//   };

//   const addWidgetToForm = (widget: WidgetOption) => {
//     const item: FormPlaylistItem = {
//       tempId: Date.now() + Math.random(), media_id: widget.id, design_project_id: null,
//       item_type: "widget", item_name: widget.name, item_sub_type: "widget",
//       duration: 15,
//     };
//     setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
//   };

//   const removeItemFromForm = (tempId: number) => { setForm((prev) => ({ ...prev, items: prev.items.filter((i) => i.tempId !== tempId) })); };
//   const updateItemDuration = (tempId: number, duration: number) => { setForm((prev) => ({ ...prev, items: prev.items.map((i) => i.tempId === tempId ? { ...i, duration: Math.max(1, duration) } : i) })); };
//   const moveItem = (index: number, direction: "up" | "down") => {
//     const newItems = [...form.items]; const targetIndex = direction === "up" ? index - 1 : index + 1;
//     if (targetIndex < 0 || targetIndex >= newItems.length) return;
//     [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
//     setForm((prev) => ({ ...prev, items: newItems }));
//   };
//   const handleDragStart = (index: number) => { setDragIndex(index); };
//   const handleDragOver = (e: React.DragEvent, index: number) => {
//     e.preventDefault(); if (dragIndex === null || dragIndex === index) return;
//     const newItems = [...form.items]; const [dragged] = newItems.splice(dragIndex, 1); newItems.splice(index, 0, dragged);
//     setForm((prev) => ({ ...prev, items: newItems })); setDragIndex(index);
//   };
//   const handleDragEnd = () => { setDragIndex(null); };
//   const toggleDay = (day: string) => { setForm((prev) => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day] })); };

//   const totalDuration = (items: { duration: number }[]) => items.reduce((sum, i) => sum + i.duration, 0);
//   const formatDuration = (secs: number) => {
//     const m = Math.floor(secs / 60); const s = secs % 60;
//     return m > 0 ? `${m}${t("durationMin")}${s > 0 ? `${s}${t("durationSec")}` : ""}` : `${s}${t("durationSec")}`;
//   };

//   return (
//     <div className="space-y-6 max-w-6xl">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">{t("schedTitle")}</h1>
//           <p className="text-sm text-muted-foreground mt-1">{t("schedSubtitle")}</p>
//         </div>
//         <div className="flex items-center gap-2 self-start">
//           {isAdmin && orgs.length > 1 && (
//             <Select value={filterOrgId} onValueChange={setFilterOrgId}>
//               <SelectTrigger className="w-[180px] h-9">
//                 <Building2 className="w-4 h-4 mr-1.5 text-muted-foreground" />
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">{t("orgFilterAll")}</SelectItem>
//                 {orgs.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
//                 <SelectItem value="none">— 未分配 —</SelectItem>
//               </SelectContent>
//             </Select>
//           )}
//           {isAdmin && (
//             <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" />{t("schedAdd")}</Button>
//           )}
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
//       ) : (
//         <>
//           {filteredSchedules.length === 0 && (
//             <Card className="p-12 text-center text-muted-foreground">
//               <CalendarClock className="w-10 h-10 mx-auto mb-3 opacity-40" />
//               <p>{t("schedNoResult")}</p>
//             </Card>
//           )}

//           <div className="grid gap-4">
//             {filteredSchedules.map((schedule, i) => (
//               <div key={schedule.id} className={`opacity-0 animate-fade-in stagger-${Math.min(i + 1, 8)} ${!schedule.enabled ? "[&>*]:opacity-60" : ""}`}>
//                 <Card className="hover-lift shadow-sm">
//                   <div className="p-4 flex items-start gap-4">
//                     <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
//                       <CalendarClock className="w-5 h-5 text-muted-foreground/60" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <h3 className="text-sm font-semibold text-foreground">{schedule.name}</h3>
//                         <Badge variant={schedule.enabled ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
//                           {schedule.enabled ? t("enabled") : t("disabled")}
//                         </Badge>
//                       </div>
//                       <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
//                         <span className="flex items-center gap-1"><Monitor className="w-3 h-3" />{schedule.screen_label}</span>
//                         <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{schedule.start_time} - {schedule.end_time}</span>
//                         <span className="flex items-center gap-1"><Play className="w-3 h-3" />{schedule.items.length} {t("schedItems")} · {formatDuration(totalDuration(schedule.items))}</span>
//                       </div>
//                       <div className="flex gap-1 mt-2">
//                         {allDaysRaw.map((day, di) => (
//                           <span key={day} className={`w-6 h-6 rounded text-[10px] font-medium flex items-center justify-center ${
//                             schedule.days.includes(day) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/40"
//                           }`}>{dayLabels[di]}</span>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 shrink-0">
//                       {isAdmin && <Switch checked={schedule.enabled} onCheckedChange={() => toggleEnabled(schedule.id, schedule.enabled)} />}
//                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(expandedId === schedule.id ? null : schedule.id)} title={t("schedPlayOrder")}>
//                         {expandedId === schedule.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                       </Button>
//                       {isAdmin && (
//                         <>
//                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(schedule)} title={t("schedEditTitle")}><Pencil className="w-4 h-4" /></Button>
//                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(schedule.id)} title={t("schedDeleted")}><Trash2 className="w-4 h-4" /></Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   {expandedId === schedule.id && (
//                     <div className="border-t border-border px-4 py-3 bg-muted/30">
//                       <p className="text-xs text-muted-foreground mb-2 font-medium">{t("schedPlayOrder")}</p>
//                       <div className="space-y-1.5">
//                         {schedule.items.map((item, index) => (
//                           <div key={item.id} className="flex items-center gap-3 bg-card rounded-lg px-3 py-2 text-sm">
//                             <span className="text-muted-foreground text-xs w-5 text-center">{index + 1}</span>
//                             <ItemIcon subType={item.item_sub_type} />
//                             <span className="flex-1 truncate text-foreground">{item.item_name}</span>
//                             {item.item_sub_type === "design" && <Badge variant="secondary" className="text-[9px] px-1 py-0">{t("schedTabDesign")}</Badge>}
//                             {item.item_sub_type === "widget" && <Badge variant="outline" className="text-[9px] px-1 py-0">{t("schedTabWidget")}</Badge>}
//                             <span className="text-xs text-muted-foreground">{item.duration}{t("seconds")}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </Card>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle>{editingId ? t("schedEditTitle") : t("schedAddTitle")}</DialogTitle></DialogHeader>
//           <div className="space-y-5 py-2">
//             <div className="space-y-2">
//               <Label>{t("schedName")} *</Label>
//               <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("schedNamePlaceholder")} />
//             </div>
//             <div className="space-y-2">
//               <Label>{t("schedScreen")} *</Label>
//               <Select value={form.screen_id} onValueChange={(v) => setForm({ ...form, screen_id: v })}>
//                 <SelectTrigger><SelectValue placeholder={t("schedSelectScreen")} /></SelectTrigger>
//                 <SelectContent>{screenOptions.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-2"><Label>{t("schedStartTime")}</Label><Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></div>
//               <div className="space-y-2"><Label>{t("schedEndTime")}</Label><Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></div>
//             </div>
//             <div className="space-y-2">
//               <Label>{t("schedPlayDays")}</Label>
//               <div className="flex gap-2">
//                 {allDaysRaw.map((day, di) => (
//                   <button key={day} type="button" onClick={() => toggleDay(day)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
//                     form.days.includes(day) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
//                   }`}>{dayLabels[di]}</button>
//                 ))}
//               </div>
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>{t("schedPlaylist")}</Label>
//                 <span className="text-xs text-muted-foreground">{form.items.length} {t("schedItems")} · {formatDuration(totalDuration(form.items))}</span>
//               </div>
//               <div className="space-y-1.5 min-h-[40px]">
//                 {form.items.length === 0 && <div className="text-center text-sm text-muted-foreground py-4 bg-muted/50 rounded-lg">{t("schedFromBelow")}</div>}
//                 {form.items.map((item, index) => (
//                   <div key={item.tempId} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd}
//                     className={`flex items-center gap-2 bg-card border border-border rounded-lg px-2 py-1.5 text-sm group transition-colors ${dragIndex === index ? "opacity-50 border-primary" : ""}`}>
//                     <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0" />
//                     <span className="text-muted-foreground text-xs w-4 text-center shrink-0">{index + 1}</span>
//                     <SmallItemIcon subType={item.item_sub_type} />
//                     <span className="flex-1 truncate text-foreground text-xs">{item.item_name}</span>
//                     <div className="flex items-center gap-1 shrink-0">
//                       <Input type="number" min={1} value={item.duration} onChange={(e) => updateItemDuration(item.tempId, parseInt(e.target.value) || 1)} className="w-14 h-7 text-xs text-center" />
//                       <span className="text-[10px] text-muted-foreground">{t("seconds")}</span>
//                     </div>
//                     <div className="flex shrink-0">
//                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, "up")} disabled={index === 0} title={t("tipMoveUp")}><ChevronUp className="w-3 h-3" /></Button>
//                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, "down")} disabled={index === form.items.length - 1} title={t("tipMoveDown")}><ChevronDown className="w-3 h-3" /></Button>
//                     </div>
//                     <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive shrink-0" onClick={() => removeItemFromForm(item.tempId)} title={t("delete")}><X className="w-3 h-3" /></Button>
//                   </div>
//                 ))}
//               </div>
//               <div className="border-t border-border pt-3 mt-3">
//                 <p className="text-xs text-muted-foreground mb-2">{t("schedClickToAdd")}</p>
//                 <Tabs defaultValue="media" className="w-full">
//                   <TabsList className="grid w-full grid-cols-3 h-8">
//                     <TabsTrigger value="media" className="text-xs gap-1"><FileImage className="w-3 h-3" />{t("schedTabMedia")}</TabsTrigger>
//                     <TabsTrigger value="design" className="text-xs gap-1"><Layers className="w-3 h-3" />{t("schedTabDesign")}</TabsTrigger>
//                     <TabsTrigger value="widget" className="text-xs gap-1"><Code2 className="w-3 h-3" />{t("schedTabWidget")}</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="media" className="mt-2">
//                     {mediaOptions.length === 0 ? (
//                       <p className="text-xs text-muted-foreground text-center py-2">{t("mediaNoResult")}</p>
//                     ) : (
//                       <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
//                         {mediaOptions.map((media) => (
//                           <button key={media.id} type="button" onClick={() => addMediaToForm(media)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors">
//                             {media.type === "image" ? <FileImage className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <FileVideo className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
//                             <span className="truncate text-xs text-foreground">{media.name}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </TabsContent>
//                   <TabsContent value="design" className="mt-2">
//                     {designOptions.length === 0 ? (
//                       <p className="text-xs text-muted-foreground text-center py-2">{t("studioNoProjects")}</p>
//                     ) : (
//                       <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
//                         {designOptions.map((dp) => (
//                           <button key={dp.id} type="button" onClick={() => addDesignToForm(dp)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors">
//                             <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
//                             <div className="truncate">
//                               <span className="text-xs text-foreground block truncate">{dp.name}</span>
//                               <span className="text-[10px] text-muted-foreground">{dp.aspect}</span>
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </TabsContent>
//                   <TabsContent value="widget" className="mt-2">
//                     {widgetOptions.length === 0 ? (
//                       <p className="text-xs text-muted-foreground text-center py-2">{t("mediaNoResult")}</p>
//                     ) : (
//                       <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
//                         {widgetOptions.map((w) => (
//                           <button key={w.id} type="button" onClick={() => addWidgetToForm(w)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors">
//                             <Code2 className="w-3.5 h-3.5 text-accent-foreground shrink-0" />
//                             <span className="truncate text-xs text-foreground">{w.name}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </TabsContent>
//                 </Tabs>
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <DialogClose asChild><Button variant="outline">{t("cancel")}</Button></DialogClose>
//             <Button onClick={handleSave} disabled={saving}>
//               {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//               {editingId ? t("schedSaveChanges") : t("schedAdd")}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>{t("schedDeleteConfirm")}</AlertDialogTitle>
//             <AlertDialogDescription>{t("schedDeleteDesc")}</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t("confirmDelete")}</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }


//verison 2
// import { useState, useEffect, useMemo } from "react";
// import { useUserRole } from "@/hooks/useUserRole";
// import { useUserOrgs } from "@/hooks/useUserOrgs";
// import { useLanguage } from "@/contexts/LanguageContext";
// import {
//   CalendarClock, Plus, Pencil, Trash2, GripVertical, ChevronUp, ChevronDown,
//   Play, Clock, Monitor, FileImage, FileVideo, X, Loader2, Layers, Code2, Building2,
// } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
//   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";
// import { mockScreens } from "@/mock/screensMockData";
// import * as mediaMockModule from "@/mock/mediaMockData";
// import { mockSchedules } from "@/mock/schedulesMockData";

// type PlaylistItemType = "media" | "design_project" | "widget";

// interface PlaylistItem {
//   id: string;
//   media_id: string | null;
//   design_project_id: string | null;
//   item_type: PlaylistItemType;
//   item_name: string;
//   item_sub_type: "image" | "video" | "design" | "widget";
//   duration: number;
//   sort_order: number;
// }

// interface Schedule {
//   id: string;
//   name: string;
//   org_id: string | null;
//   screen_id: string;
//   screen_label: string;
//   start_time: string;
//   end_time: string;
//   days: string[];
//   start_date: string | null;
//   end_date: string | null;
//   enabled: boolean;
//   items: PlaylistItem[];
// }

// type ScheduleMode = "weekly" | "calendar";

// interface ScreenOption { id: string; label: string; }
// interface MediaOption { id: string; name: string; type: "image" | "video" | "widget"; }
// interface DesignProjectOption { id: string; name: string; aspect: string; }
// interface WidgetOption { id: string; name: string; }

// interface FormPlaylistItem {
//   tempId: number;
//   media_id: string | null;
//   design_project_id: string | null;
//   item_type: PlaylistItemType;
//   item_name: string;
//   item_sub_type: "image" | "video" | "design" | "widget";
//   duration: number;
// }


// type RawMockMediaItem = Record<string, any>;

// function normalizeMockMediaType(value: any, item?: RawMockMediaItem): "image" | "video" | "widget" {
//   const raw = String(
//     value ??
//     item?.type ??
//     item?.media_type ??
//     item?.item_type ??
//     item?.sub_type ??
//     item?.category ??
//     item?.kind ??
//     item?.file_type ??
//     item?.mime_type ??
//     ""
//   ).toLowerCase();

//   if (raw.includes("widget")) return "widget";
//   if (raw.includes("video") || raw.includes("mp4") || raw.includes("mov") || raw.includes("webm")) return "video";
//   return "image";
// }

// function extractMockMediaOptions(): { media: MediaOption[]; widgets: WidgetOption[] } {
//   const moduleCandidate = mediaMockModule as Record<string, any>;
//   const directArray = Array.isArray(moduleCandidate.default)
//     ? moduleCandidate.default
//     : Array.isArray(moduleCandidate.mockMedia)
//       ? moduleCandidate.mockMedia
//       : Array.isArray(moduleCandidate.mockMediaData)
//         ? moduleCandidate.mockMediaData
//         : Array.isArray(moduleCandidate.mediaMockData)
//           ? moduleCandidate.mediaMockData
//           : Array.isArray(moduleCandidate.mediaItems)
//             ? moduleCandidate.mediaItems
//             : null;

//   const inferredArray = directArray || Object.values(moduleCandidate).find(
//     (value) => Array.isArray(value) && value.every((item) => item && typeof item === "object")
//   );

//   const rawList = (Array.isArray(inferredArray) ? inferredArray : []) as RawMockMediaItem[];

//   const normalized = rawList.map((item, index) => {
//     const id = String(item.id ?? item.media_id ?? item.uuid ?? item.key ?? `mock-media-${index + 1}`);
//     const name = String(item.name ?? item.title ?? item.file_name ?? item.filename ?? item.label ?? `素材 ${index + 1}`);
//     const type = normalizeMockMediaType(item.type, item);
//     return { id, name, type };
//   });

//   return {
//     media: normalized.filter((item) => item.type !== "widget"),
//     widgets: normalized.filter((item) => item.type === "widget").map((item) => ({ id: item.id, name: item.name })),
//   };
// }

// function ItemIcon({ subType }: { subType: "image" | "video" | "design" | "widget" }) {
//   if (subType === "design") return <Layers className="w-4 h-4 text-primary shrink-0" />;
//   if (subType === "widget") return <Code2 className="w-4 h-4 text-accent-foreground shrink-0" />;
//   if (subType === "video") return <FileVideo className="w-4 h-4 text-muted-foreground shrink-0" />;
//   return <FileImage className="w-4 h-4 text-muted-foreground shrink-0" />;
// }

// function SmallItemIcon({ subType }: { subType: "image" | "video" | "design" | "widget" }) {
//   if (subType === "design") return <Layers className="w-3.5 h-3.5 text-primary shrink-0" />;
//   if (subType === "widget") return <Code2 className="w-3.5 h-3.5 text-accent-foreground shrink-0" />;
//   if (subType === "video") return <FileVideo className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
//   return <FileImage className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
// }

// export default function SchedulesPage() {
//   const { isAdmin } = useUserRole();
//   const { t, language } = useLanguage();
//   const { orgs, defaultOrgId } = useUserOrgs();
//   const [schedules, setSchedules] = useState<Schedule[]>([]);
//   const [screenOptions, setScreenOptions] = useState<ScreenOption[]>([]);
//   const [mediaOptions, setMediaOptions] = useState<MediaOption[]>([]);
//   const [widgetOptions, setWidgetOptions] = useState<WidgetOption[]>([]);
//   const [designOptions, setDesignOptions] = useState<DesignProjectOption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [dragIndex, setDragIndex] = useState<number | null>(null);
//   const [filterOrgId, setFilterOrgId] = useState<string>("all");

//   const createEmptyForm = () => ({
//     mode: "weekly" as ScheduleMode,
//     name: "",
//     screen_id: "",
//     startTime: "09:00",
//     endTime: "18:00",
//     days: ["一", "二", "三", "四", "五"] as string[],
//     startDate: "",
//     endDate: "",
//     items: [] as FormPlaylistItem[],
//   });

//   const [form, setForm] = useState(createEmptyForm);

//   const dayKeys = ["dayMon", "dayTue", "dayWed", "dayThu", "dayFri", "daySat", "daySun"] as const;
//   const allDaysRaw = ["一", "二", "三", "四", "五", "六", "日"];
//   const dayLabels = dayKeys.map((k) => t(k));

//   const buildScreenOptions = () => {
//     const screenMapById = new Map<string, ScreenOption>();

//     (mockScreens || []).forEach((s) => {
//       const branch = s.branch?.trim() || "未分館";
//       const name = s.name?.trim() || `螢幕 ${s.id}`;
//       screenMapById.set(String(s.id), {
//         id: String(s.id),
//         label: `${branch} - ${name}`,
//       });
//     });

//     return Array.from(screenMapById.values()).sort((a, b) =>
//       a.label.localeCompare(b.label, "zh-Hant")
//     );
//   };

//   const buildScheduleScreenLabel = (screenId: string) => {
//     const matched = (mockScreens || []).find((screen) => String(screen.id) === String(screenId));
//     if (!matched) return "";
//     const branch = matched.branch?.trim() || "未分館";
//     const name = matched.name?.trim() || `螢幕 ${matched.id}`;
//     return `${branch} - ${name}`;
//   };

//   const buildMockSchedules = (): Schedule[] => {
//     return (mockSchedules || []).map((schedule) => ({
//       ...schedule,
//       screen_id: String(schedule.screen_id),
//       screen_label: schedule.screen_label || buildScheduleScreenLabel(String(schedule.screen_id)),
//       items: (schedule.items || []).map((item, index) => ({
//         ...item,
//         sort_order: typeof item.sort_order === "number" ? item.sort_order : index,
//       })),
//     }));
//   };

//   useEffect(() => {
//     setLoading(true);

//     setScreenOptions(buildScreenOptions());
//     setSchedules(buildMockSchedules());

//     const mockMedia = extractMockMediaOptions();
//     setMediaOptions(mockMedia.media);
//     setWidgetOptions(mockMedia.widgets);

//     setDesignOptions([]);
//     setLoading(false);
//   }, []);



//   const createId = () => {
//     if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
//     return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
//   };

//   const filteredSchedules = useMemo(() => {
//     if (filterOrgId === "all") return schedules;
//     if (filterOrgId === "none") return schedules.filter(s => !s.org_id);
//     return schedules.filter(s => s.org_id === filterOrgId);
//   }, [schedules, filterOrgId]);

//   const openAdd = () => {
//     setEditingId(null);
//     setForm(createEmptyForm());
//     setDialogOpen(true);
//   };

//   const openEdit = (s: Schedule) => {
//     const isCalendarMode = !!s.start_date || !!s.end_date;

//     setEditingId(s.id);
//     setForm({
//       mode: isCalendarMode ? "calendar" : "weekly",
//       name: s.name,
//       screen_id: s.screen_id,
//       startTime: s.start_time,
//       endTime: s.end_time,
//       days: [...s.days],
//       startDate: s.start_date || "",
//       endDate: s.end_date || "",
//       items: s.items.map((i) => ({
//         tempId: Math.random(),
//         media_id: i.media_id,
//         design_project_id: i.design_project_id,
//         item_type: i.item_type,
//         item_name: i.item_name,
//         item_sub_type: i.item_sub_type,
//         duration: i.duration,
//       })),
//     });
//     setDialogOpen(true);
//   };

//   const handleSave = async () => {
//     if (!form.name || !form.screen_id) { toast.error(t("schedFillRequired")); return; }
//     if (form.items.length === 0) { toast.error(t("schedAddItem")); return; }
//     if (form.mode === "weekly" && form.days.length === 0) { toast.error(t("schedPlayDays")); return; }
//     if (form.mode === "calendar" && (!form.startDate || !form.endDate)) { toast.error("請選擇起訖日期"); return; }
//     if (form.mode === "calendar" && form.startDate > form.endDate) { toast.error("結束日期不可早於開始日期"); return; }

//     setSaving(true);

//     const selectedScreen = screenOptions.find((screen) => screen.id === form.screen_id);
//     const nextItems: PlaylistItem[] = form.items.map((item, index) => ({
//       id: createId(),
//       media_id: item.media_id,
//       design_project_id: item.design_project_id,
//       item_type: item.item_type,
//       item_name: item.item_name,
//       item_sub_type: item.item_sub_type,
//       duration: item.duration,
//       sort_order: index,
//     }));

//     const nextSchedule: Schedule = {
//       id: editingId || createId(),
//       name: form.name,
//       org_id: defaultOrgId || null,
//       screen_id: form.screen_id,
//       screen_label: selectedScreen?.label || "",
//       start_time: form.startTime,
//       end_time: form.endTime,
//       days: form.mode === "weekly" ? form.days : [],
//       start_date: form.mode === "calendar" ? form.startDate : null,
//       end_date: form.mode === "calendar" ? form.endDate : null,
//       enabled: true,
//       items: nextItems,
//     };

//     if (editingId) {
//       setSchedules((prev) => prev.map((schedule) => (
//         schedule.id === editingId
//           ? { ...nextSchedule, enabled: schedule.enabled, org_id: schedule.org_id }
//           : schedule
//       )));
//       toast.success(t("schedUpdated"));
//     } else {
//       setSchedules((prev) => [...prev, nextSchedule]);
//       toast.success(t("schedAdded"));
//     }

//     setSaving(false);
//     setDialogOpen(false);
//     setEditingId(null);
//     setForm(createEmptyForm());
//   };

//   const handleDelete = async () => {
//     if (deleteId) {
//       setSchedules((prev) => prev.filter((schedule) => schedule.id !== deleteId));
//       toast.success(t("schedDeleted"));
//       setDeleteId(null);
//       if (expandedId === deleteId) setExpandedId(null);
//     }
//   };

//   const toggleEnabled = async (id: string, current: boolean) => {
//     setSchedules((prev) => prev.map((schedule) => (
//       schedule.id === id ? { ...schedule, enabled: !current } : schedule
//     )));
//   };

//   const addMediaToForm = (media: MediaOption) => {
//     const item: FormPlaylistItem = {
//       tempId: Date.now() + Math.random(), media_id: media.id, design_project_id: null,
//       item_type: "media", item_name: media.name, item_sub_type: media.type,
//       duration: media.type === "video" ? 30 : 10,
//     };
//     setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
//   };

//   const addDesignToForm = async (dp: DesignProjectOption) => {
//     const item: FormPlaylistItem = {
//       tempId: Date.now() + Math.random(), media_id: null, design_project_id: dp.id,
//       item_type: "design_project", item_name: dp.name, item_sub_type: "design",
//       duration: 15,
//     };
//     setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
//   };

//   const addWidgetToForm = (widget: WidgetOption) => {
//     const item: FormPlaylistItem = {
//       tempId: Date.now() + Math.random(), media_id: widget.id, design_project_id: null,
//       item_type: "widget", item_name: widget.name, item_sub_type: "widget",
//       duration: 15,
//     };
//     setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
//   };

//   const removeItemFromForm = (tempId: number) => { setForm((prev) => ({ ...prev, items: prev.items.filter((i) => i.tempId !== tempId) })); };
//   const updateItemDuration = (tempId: number, duration: number) => { setForm((prev) => ({ ...prev, items: prev.items.map((i) => i.tempId === tempId ? { ...i, duration: Math.max(1, duration) } : i) })); };
//   const moveItem = (index: number, direction: "up" | "down") => {
//     const newItems = [...form.items]; const targetIndex = direction === "up" ? index - 1 : index + 1;
//     if (targetIndex < 0 || targetIndex >= newItems.length) return;
//     [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
//     setForm((prev) => ({ ...prev, items: newItems }));
//   };
//   const handleDragStart = (index: number) => { setDragIndex(index); };
//   const handleDragOver = (e: React.DragEvent, index: number) => {
//     e.preventDefault(); if (dragIndex === null || dragIndex === index) return;
//     const newItems = [...form.items]; const [dragged] = newItems.splice(dragIndex, 1); newItems.splice(index, 0, dragged);
//     setForm((prev) => ({ ...prev, items: newItems })); setDragIndex(index);
//   };
//   const handleDragEnd = () => { setDragIndex(null); };
//   const toggleDay = (day: string) => { setForm((prev) => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day] })); };

//   const totalDuration = (items: { duration: number }[]) => items.reduce((sum, i) => sum + i.duration, 0);
//   const formatDuration = (secs: number) => {
//     const m = Math.floor(secs / 60); const s = secs % 60;
//     return m > 0 ? `${m}${t("durationMin")}${s > 0 ? `${s}${t("durationSec")}` : ""}` : `${s}${t("durationSec")}`;
//   };

//   return (
//     <div className="space-y-6 max-w-6xl">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">{t("schedTitle")}</h1>
//           <p className="text-sm text-muted-foreground mt-1">{t("schedSubtitle")}</p>
//         </div>
//         <div className="flex items-center gap-2 self-start">
//           {isAdmin && orgs.length > 1 && (
//             <Select value={filterOrgId} onValueChange={setFilterOrgId}>
//               <SelectTrigger className="w-[180px] h-9">
//                 <Building2 className="w-4 h-4 mr-1.5 text-muted-foreground" />
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">{t("orgFilterAll")}</SelectItem>
//                 {orgs.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
//                 <SelectItem value="none">— 未分配 —</SelectItem>
//               </SelectContent>
//             </Select>
//           )}
//           {isAdmin && (
//             <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" />{t("schedAdd")}</Button>
//           )}
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
//       ) : (
//         <>
//           {filteredSchedules.length === 0 && (
//             <Card className="p-12 text-center text-muted-foreground">
//               <CalendarClock className="w-10 h-10 mx-auto mb-3 opacity-40" />
//               <p>{t("schedNoResult")}</p>
//             </Card>
//           )}

//           <div className="grid gap-4">
//             {filteredSchedules.map((schedule, i) => (
//               <div key={schedule.id} className={`opacity-0 animate-fade-in stagger-${Math.min(i + 1, 8)} ${!schedule.enabled ? "[&>*]:opacity-60" : ""}`}>
//                 <Card className="hover-lift shadow-sm">
//                   <div className="p-4 flex items-start gap-4">
//                     <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
//                       <CalendarClock className="w-5 h-5 text-muted-foreground/60" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <h3 className="text-sm font-semibold text-foreground">{schedule.name}</h3>
//                         <Badge variant={schedule.enabled ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
//                           {schedule.enabled ? t("enabled") : t("disabled")}
//                         </Badge>
//                       </div>
//                       <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
//                         <span className="flex items-center gap-1"><Monitor className="w-3 h-3" />{schedule.screen_label}</span>
//                         <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{schedule.start_time} - {schedule.end_time}</span>
//                         <span className="flex items-center gap-1"><Play className="w-3 h-3" />{schedule.items.length} {t("schedItems")} · {formatDuration(totalDuration(schedule.items))}</span>
//                       </div>
//                       {!!schedule.start_date || !!schedule.end_date ? (
//                         <div className="mt-2">
//                           <span className="inline-flex rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
//                             {schedule.start_date || "—"} ~ {schedule.end_date || "—"}
//                           </span>
//                         </div>
//                       ) : (
//                         <div className="flex gap-1 mt-2">
//                           {allDaysRaw.map((day, di) => (
//                             <span key={day} className={`w-6 h-6 rounded text-[10px] font-medium flex items-center justify-center ${schedule.days.includes(day) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/40"
//                               }`}>{dayLabels[di]}</span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2 shrink-0">
//                       {isAdmin && <Switch checked={schedule.enabled} onCheckedChange={() => toggleEnabled(schedule.id, schedule.enabled)} />}
//                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(expandedId === schedule.id ? null : schedule.id)} title={t("schedPlayOrder")}>
//                         {expandedId === schedule.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                       </Button>
//                       {isAdmin && (
//                         <>
//                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(schedule)} title={t("schedEditTitle")}><Pencil className="w-4 h-4" /></Button>
//                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(schedule.id)} title={t("schedDeleted")}><Trash2 className="w-4 h-4" /></Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   {expandedId === schedule.id && (
//                     <div className="border-t border-border px-4 py-3 bg-muted/30">
//                       <p className="text-xs text-muted-foreground mb-2 font-medium">{t("schedPlayOrder")}</p>
//                       <div className="space-y-1.5">
//                         {schedule.items.map((item, index) => (
//                           <div key={item.id} className="flex items-center gap-3 bg-card rounded-lg px-3 py-2 text-sm">
//                             <span className="text-muted-foreground text-xs w-5 text-center">{index + 1}</span>
//                             <ItemIcon subType={item.item_sub_type} />
//                             <span className="flex-1 truncate text-foreground">{item.item_name}</span>
//                             {item.item_sub_type === "design" && <Badge variant="secondary" className="text-[9px] px-1 py-0">{t("schedTabDesign")}</Badge>}
//                             {item.item_sub_type === "widget" && <Badge variant="outline" className="text-[9px] px-1 py-0">{t("schedTabWidget")}</Badge>}
//                             <span className="text-xs text-muted-foreground">{item.duration}{t("seconds")}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </Card>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle>{editingId ? t("schedEditTitle") : t("schedAddTitle")}</DialogTitle></DialogHeader>
//           <div className="space-y-5 py-2">
//             <Tabs
//               value={form.mode}
//               onValueChange={(value) =>
//                 setForm((prev) => ({
//                   ...prev,
//                   mode: value as ScheduleMode,
//                   days: value === "weekly" ? (prev.days.length ? prev.days : ["一", "二", "三", "四", "五"]) : [],
//                   startDate: value === "calendar" ? prev.startDate : "",
//                   endDate: value === "calendar" ? prev.endDate : "",
//                 }))
//               }
//               className="w-full"
//             >
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="weekly">周播</TabsTrigger>
//                 <TabsTrigger value="calendar">日曆</TabsTrigger>
//               </TabsList>
//             </Tabs>

//             <div className="space-y-2">
//               <Label>{t("schedName")} *</Label>
//               <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("schedNamePlaceholder")} />
//             </div>
//             <div className="space-y-2">
//               <Label>{t("schedScreen")} *</Label>
//               <Select value={form.screen_id} onValueChange={(v) => setForm({ ...form, screen_id: v })}>
//                 <SelectTrigger><SelectValue placeholder={t("schedSelectScreen")} /></SelectTrigger>
//                 <SelectContent>{screenOptions.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
//               </Select>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-2"><Label>{t("schedStartTime")}</Label><Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></div>
//               <div className="space-y-2"><Label>{t("schedEndTime")}</Label><Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></div>
//             </div>
//             {form.mode === "weekly" ? (
//               <div className="space-y-2">
//                 <Label>{t("schedPlayDays")}</Label>
//                 <div className="flex gap-2 flex-wrap">
//                   {allDaysRaw.map((day, di) => (
//                     <button
//                       key={day}
//                       type="button"
//                       onClick={() => toggleDay(day)}
//                       className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${form.days.includes(day) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
//                         }`}
//                     >
//                       {dayLabels[di]}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-2">
//                   <Label>開始日期</Label>
//                   <Input
//                     type="date"
//                     value={form.startDate}
//                     onChange={(e) => setForm({ ...form, startDate: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>結束日期</Label>
//                   <Input
//                     type="date"
//                     value={form.endDate}
//                     onChange={(e) => setForm({ ...form, endDate: e.target.value })}
//                   />
//                 </div>
//               </div>
//             )}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>{t("schedPlaylist")}</Label>
//                 <span className="text-xs text-muted-foreground">{form.items.length} {t("schedItems")} · {formatDuration(totalDuration(form.items))}</span>
//               </div>
//               <div className="space-y-1.5 min-h-[40px]">
//                 {form.items.length === 0 && <div className="text-center text-sm text-muted-foreground py-4 bg-muted/50 rounded-lg">{t("schedFromBelow")}</div>}
//                 {form.items.map((item, index) => (
//                   <div key={item.tempId} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd}
//                     className={`flex items-center gap-2 bg-card border border-border rounded-lg px-2 py-1.5 text-sm group transition-colors ${dragIndex === index ? "opacity-50 border-primary" : ""}`}>
//                     <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0" />
//                     <span className="text-muted-foreground text-xs w-4 text-center shrink-0">{index + 1}</span>
//                     <SmallItemIcon subType={item.item_sub_type} />
//                     <span className="flex-1 truncate text-foreground text-xs">{item.item_name}</span>
//                     <div className="flex items-center gap-1 shrink-0">
//                       <Input type="number" min={1} value={item.duration} onChange={(e) => updateItemDuration(item.tempId, parseInt(e.target.value) || 1)} className="w-14 h-7 text-xs text-center" />
//                       <span className="text-[10px] text-muted-foreground">{t("seconds")}</span>
//                     </div>
//                     <div className="flex shrink-0">
//                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, "up")} disabled={index === 0} title={t("tipMoveUp")}><ChevronUp className="w-3 h-3" /></Button>
//                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, "down")} disabled={index === form.items.length - 1} title={t("tipMoveDown")}><ChevronDown className="w-3 h-3" /></Button>
//                     </div>
//                     <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive shrink-0" onClick={() => removeItemFromForm(item.tempId)} title={t("delete")}><X className="w-3 h-3" /></Button>
//                   </div>
//                 ))}
//               </div>
//               <div className="border-t border-border pt-3 mt-3">
//                 <p className="text-xs text-muted-foreground mb-2">{t("schedClickToAdd")}</p>
//                 <Tabs defaultValue="media" className="w-full">
//                   <TabsList className="grid w-full grid-cols-3 h-8">
//                     <TabsTrigger value="media" className="text-xs gap-1"><FileImage className="w-3 h-3" />{t("schedTabMedia")}</TabsTrigger>
//                     <TabsTrigger value="design" className="text-xs gap-1"><Layers className="w-3 h-3" />{t("schedTabDesign")}</TabsTrigger>
//                     <TabsTrigger value="widget" className="text-xs gap-1"><Code2 className="w-3 h-3" />{t("schedTabWidget")}</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="media" className="mt-2">
//                     {mediaOptions.length === 0 ? (
//                       <p className="text-xs text-muted-foreground text-center py-2">{t("mediaNoResult")}</p>
//                     ) : (
//                       <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
//                         {mediaOptions.map((media) => (
//                           <button key={media.id} type="button" onClick={() => addMediaToForm(media)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors">
//                             {media.type === "image" ? <FileImage className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <FileVideo className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
//                             <span className="truncate text-xs text-foreground">{media.name}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </TabsContent>
//                   <TabsContent value="design" className="mt-2">
//                     {designOptions.length === 0 ? (
//                       <p className="text-xs text-muted-foreground text-center py-2">{t("studioNoProjects")}</p>
//                     ) : (
//                       <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
//                         {designOptions.map((dp) => (
//                           <button key={dp.id} type="button" onClick={() => addDesignToForm(dp)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors">
//                             <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
//                             <div className="truncate">
//                               <span className="text-xs text-foreground block truncate">{dp.name}</span>
//                               <span className="text-[10px] text-muted-foreground">{dp.aspect}</span>
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </TabsContent>
//                   <TabsContent value="widget" className="mt-2">
//                     {widgetOptions.length === 0 ? (
//                       <p className="text-xs text-muted-foreground text-center py-2">{t("mediaNoResult")}</p>
//                     ) : (
//                       <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
//                         {widgetOptions.map((w) => (
//                           <button key={w.id} type="button" onClick={() => addWidgetToForm(w)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors">
//                             <Code2 className="w-3.5 h-3.5 text-accent-foreground shrink-0" />
//                             <span className="truncate text-xs text-foreground">{w.name}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </TabsContent>
//                 </Tabs>
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <DialogClose asChild><Button variant="outline">{t("cancel")}</Button></DialogClose>
//             <Button onClick={handleSave} disabled={saving}>
//               {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//               {editingId ? t("schedSaveChanges") : t("schedAdd")}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>{t("schedDeleteConfirm")}</AlertDialogTitle>
//             <AlertDialogDescription>{t("schedDeleteDesc")}</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t("confirmDelete")}</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

//version 3
// import { useState, useEffect, useMemo } from "react";
// import { useUserRole } from "@/hooks/useUserRole";
// import { useUserOrgs } from "@/hooks/useUserOrgs";
// import { useLanguage } from "@/contexts/LanguageContext";
// import {
//   CalendarClock, Plus, Pencil, Trash2, GripVertical, ChevronUp, ChevronDown,
//   Play, Clock, Monitor, FileImage, FileVideo, X, Loader2, Layers, Code2, Building2,
// } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
//   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";
// import { mockScreens } from "@/mock/screensMockData";
// import * as mediaMockModule from "@/mock/mediaMockData";
// import { mockSchedules } from "@/mock/schedulesMockData";

// type PlaylistItemType = "media" | "design_project" | "widget";

// interface PlaylistItem {
//   id: string;
//   media_id: string | null;
//   design_project_id: string | null;
//   item_type: PlaylistItemType;
//   item_name: string;
//   item_sub_type: "image" | "video" | "design" | "widget";
//   duration: number;
//   sort_order: number;
// }

// interface Schedule {
//   id: string;
//   name: string;
//   org_id: string | null;
//   screen_id: string;
//   screen_label: string;
//   start_time: string;
//   end_time: string;
//   days: string[];
//   start_date: string | null;
//   end_date: string | null;
//   enabled: boolean;
//   items: PlaylistItem[];
// }

// interface ScreenOption { id: string; label: string; groupLabel: string; }
// interface DeviceGroupOption { id: string; label: string; }
// interface MediaOption { id: string; name: string; type: "image" | "video" | "widget"; }
// interface DesignProjectOption { id: string; name: string; aspect: string; }
// interface WidgetOption { id: string; name: string; }

// interface FormPlaylistItem {
//   tempId: number;
//   media_id: string | null;
//   design_project_id: string | null;
//   item_type: PlaylistItemType;
//   item_name: string;
//   item_sub_type: "image" | "video" | "design" | "widget";
//   duration: number;
// }


// type RawMockMediaItem = Record<string, any>;

// function normalizeMockMediaType(value: any, item?: RawMockMediaItem): "image" | "video" | "widget" {
//   const raw = String(
//     value ??
//     item?.type ??
//     item?.media_type ??
//     item?.item_type ??
//     item?.sub_type ??
//     item?.category ??
//     item?.kind ??
//     item?.file_type ??
//     item?.mime_type ??
//     ""
//   ).toLowerCase();

//   if (raw.includes("widget")) return "widget";
//   if (raw.includes("video") || raw.includes("mp4") || raw.includes("mov") || raw.includes("webm")) return "video";
//   return "image";
// }

// function extractMockMediaOptions(): { media: MediaOption[]; widgets: WidgetOption[] } {
//   const moduleCandidate = mediaMockModule as Record<string, any>;
//   const directArray = Array.isArray(moduleCandidate.default)
//     ? moduleCandidate.default
//     : Array.isArray(moduleCandidate.mockMedia)
//       ? moduleCandidate.mockMedia
//       : Array.isArray(moduleCandidate.mockMediaData)
//         ? moduleCandidate.mockMediaData
//         : Array.isArray(moduleCandidate.mediaMockData)
//           ? moduleCandidate.mediaMockData
//           : Array.isArray(moduleCandidate.mediaItems)
//             ? moduleCandidate.mediaItems
//             : null;

//   const inferredArray = directArray || Object.values(moduleCandidate).find(
//     (value) => Array.isArray(value) && value.every((item) => item && typeof item === "object")
//   );

//   const rawList = (Array.isArray(inferredArray) ? inferredArray : []) as RawMockMediaItem[];

//   const normalized = rawList.map((item, index) => {
//     const id = String(item.id ?? item.media_id ?? item.uuid ?? item.key ?? `mock-media-${index + 1}`);
//     const name = String(item.name ?? item.title ?? item.file_name ?? item.filename ?? item.label ?? `素材 ${index + 1}`);
//     const type = normalizeMockMediaType(item.type, item);
//     return { id, name, type };
//   });

//   return {
//     media: normalized.filter((item) => item.type !== "widget"),
//     widgets: normalized.filter((item) => item.type === "widget").map((item) => ({ id: item.id, name: item.name })),
//   };
// }

// function ItemIcon({ subType }: { subType: "image" | "video" | "design" | "widget" }) {
//   if (subType === "design") return <Layers className="w-4 h-4 text-primary shrink-0" />;
//   if (subType === "widget") return <Code2 className="w-4 h-4 text-accent-foreground shrink-0" />;
//   if (subType === "video") return <FileVideo className="w-4 h-4 text-muted-foreground shrink-0" />;
//   return <FileImage className="w-4 h-4 text-muted-foreground shrink-0" />;
// }

// function SmallItemIcon({ subType }: { subType: "image" | "video" | "design" | "widget" }) {
//   if (subType === "design") return <Layers className="w-3.5 h-3.5 text-primary shrink-0" />;
//   if (subType === "widget") return <Code2 className="w-3.5 h-3.5 text-accent-foreground shrink-0" />;
//   if (subType === "video") return <FileVideo className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
//   return <FileImage className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
// }

// export default function SchedulesPage() {
//   const { isAdmin } = useUserRole();
//   const { t, language } = useLanguage();
//   const { orgs, defaultOrgId } = useUserOrgs();
//   const [schedules, setSchedules] = useState<Schedule[]>([]);
//   const [screenOptions, setScreenOptions] = useState<ScreenOption[]>([]);
//   const [deviceGroupOptions, setDeviceGroupOptions] = useState<DeviceGroupOption[]>([]);
//   const [mediaOptions, setMediaOptions] = useState<MediaOption[]>([]);
//   const [widgetOptions, setWidgetOptions] = useState<WidgetOption[]>([]);
//   const [designOptions, setDesignOptions] = useState<DesignProjectOption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [dragIndex, setDragIndex] = useState<number | null>(null);
//   const [filterOrgId, setFilterOrgId] = useState<string>("all");

//   const createEmptyForm = () => ({
//     enableCalendar: false,
//     name: "",
//     screen_group: "all",
//     screen_id: "",
//     startTime: "09:00",
//     endTime: "18:00",
//     days: ["一", "二", "三", "四", "五"] as string[],
//     startDate: "",
//     endDate: "",
//     items: [] as FormPlaylistItem[],
//     joinDefaultSchedule: false,
//   });

//   const [form, setForm] = useState(createEmptyForm);

//   const dayKeys = ["dayMon", "dayTue", "dayWed", "dayThu", "dayFri", "daySat", "daySun"] as const;
//   const allDaysRaw = ["一", "二", "三", "四", "五", "六", "日"];
//   const dayLabels = dayKeys.map((k) => t(k));

//   const buildScreenOptions = () => {
//     const screenMapById = new Map<string, ScreenOption>();

//     (mockScreens || []).forEach((s) => {
//       const branch = s.branch?.trim() || "未分館";
//       const name = s.name?.trim() || `螢幕 ${s.id}`;
//       screenMapById.set(String(s.id), {
//         id: String(s.id),
//         label: `${branch} - ${name}`,
//         groupLabel: branch,
//       });
//     });

//     return Array.from(screenMapById.values()).sort((a, b) =>
//       a.label.localeCompare(b.label, "zh-Hant")
//     );
//   };

//   const buildDeviceGroupOptions = () => {
//     const groupSet = new Set<string>();

//     (mockScreens || []).forEach((s) => {
//       const branch = s.branch?.trim() || "未分館";
//       groupSet.add(branch);
//     });

//     return Array.from(groupSet)
//       .sort((a, b) => a.localeCompare(b, "zh-Hant"))
//       .map((group) => ({ id: group, label: group }));
//   };

//   const buildScheduleScreenLabel = (screenId: string) => {
//     const matched = (mockScreens || []).find((screen) => String(screen.id) === String(screenId));
//     if (!matched) return "";
//     const branch = matched.branch?.trim() || "未分館";
//     const name = matched.name?.trim() || `螢幕 ${matched.id}`;
//     return `${branch} - ${name}`;
//   };

//   const buildMockSchedules = (): Schedule[] => {
//     return (mockSchedules || []).map((schedule) => ({
//       ...schedule,
//       screen_id: String(schedule.screen_id),
//       screen_label: schedule.screen_label || buildScheduleScreenLabel(String(schedule.screen_id)),
//       items: (schedule.items || []).map((item, index) => ({
//         ...item,
//         sort_order: typeof item.sort_order === "number" ? item.sort_order : index,
//       })),
//     }));
//   };

//   useEffect(() => {
//     setLoading(true);

//     setScreenOptions(buildScreenOptions());
//     setDeviceGroupOptions(buildDeviceGroupOptions());
//     setSchedules(buildMockSchedules());

//     const mockMedia = extractMockMediaOptions();
//     setMediaOptions(mockMedia.media);
//     setWidgetOptions(mockMedia.widgets);

//     setDesignOptions([]);
//     setLoading(false);
//   }, []);



//   const createId = () => {
//     if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
//     return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
//   };

//   const filteredSchedules = useMemo(() => {
//     if (filterOrgId === "all") return schedules;
//     if (filterOrgId === "none") return schedules.filter(s => !s.org_id);
//     return schedules.filter(s => s.org_id === filterOrgId);
//   }, [schedules, filterOrgId]);

//   const filteredScreenOptions = useMemo(() => {
//     if (form.screen_group === "all") return screenOptions;
//     return screenOptions.filter((screen) => screen.groupLabel === form.screen_group);
//   }, [form.screen_group, screenOptions]);

//   //新增排程
//   const openAdd = () => {
//     setEditingId(null);
//     setForm(createEmptyForm());
//     setDialogOpen(true);
//   };

//   const openEdit = (s: Schedule) => {
//     const isCalendarMode = !!s.start_date || !!s.end_date;

//     setEditingId(s.id);
//     setForm({
//       enableCalendar: isCalendarMode,
//       name: s.name,
//       screen_group: screenOptions.find((screen) => screen.id === s.screen_id)?.groupLabel || "all",
//       screen_id: s.screen_id,
//       startTime: s.start_time,
//       endTime: s.end_time,
//       days: [...s.days],
//       startDate: s.start_date || "",
//       endDate: s.end_date || "",
//       joinDefaultSchedule: false,
//       items: s.items.map((i) => ({
//         tempId: Math.random(),
//         media_id: i.media_id,
//         design_project_id: i.design_project_id,
//         item_type: i.item_type,
//         item_name: i.item_name,
//         item_sub_type: i.item_sub_type,
//         duration: i.duration,
//       })),
//     });
//     setDialogOpen(true);
//   };

//   const handleSave = async () => {
//     if (!form.name || !form.screen_id) { toast.error(t("schedFillRequired")); return; }
//     if (form.items.length === 0) { toast.error(t("schedAddItem")); return; }
//     if (form.days.length === 0) { toast.error(t("schedPlayDays")); return; }
//     if (form.enableCalendar && (!form.startDate || !form.endDate)) { toast.error("請選擇起訖日期"); return; }
//     if (form.enableCalendar && form.startDate > form.endDate) { toast.error("結束日期不可早於開始日期"); return; }

//     setSaving(true);

//     const selectedScreen = screenOptions.find((screen) => screen.id === form.screen_id);
//     const nextItems: PlaylistItem[] = form.items.map((item, index) => ({
//       id: createId(),
//       media_id: item.media_id,
//       design_project_id: item.design_project_id,
//       item_type: item.item_type,
//       item_name: item.item_name,
//       item_sub_type: item.item_sub_type,
//       duration: item.duration,
//       sort_order: index,
//     }));

//     const nextSchedule: Schedule = {
//       id: editingId || createId(),
//       name: form.name,
//       org_id: defaultOrgId || null,
//       screen_id: form.screen_id,
//       screen_label: selectedScreen?.label || "",
//       start_time: form.startTime,
//       end_time: form.endTime,
//       days: form.days,
//       start_date: form.enableCalendar ? form.startDate : null,
//       end_date: form.enableCalendar ? form.endDate : null,
//       enabled: true,
//       items: nextItems,
//     };

//     if (editingId) {
//       setSchedules((prev) => prev.map((schedule) => (
//         schedule.id === editingId
//           ? { ...nextSchedule, enabled: schedule.enabled, org_id: schedule.org_id }
//           : schedule
//       )));
//       toast.success(t("schedUpdated"));
//     } else {
//       setSchedules((prev) => [...prev, nextSchedule]);
//       toast.success(t("schedAdded"));
//     }

//     setSaving(false);
//     setDialogOpen(false);
//     setEditingId(null);
//     setForm(createEmptyForm());
//   };

//   const handleDelete = async () => {
//     if (deleteId) {
//       setSchedules((prev) => prev.filter((schedule) => schedule.id !== deleteId));
//       toast.success(t("schedDeleted"));
//       setDeleteId(null);
//       if (expandedId === deleteId) setExpandedId(null);
//     }
//   };

//   const toggleEnabled = async (id: string, current: boolean) => {
//     setSchedules((prev) => prev.map((schedule) => (
//       schedule.id === id ? { ...schedule, enabled: !current } : schedule
//     )));
//   };

//   const addMediaToForm = (media: MediaOption) => {
//     const item: FormPlaylistItem = {
//       tempId: Date.now() + Math.random(), media_id: media.id, design_project_id: null,
//       item_type: "media", item_name: media.name, item_sub_type: media.type,
//       duration: media.type === "video" ? 30 : 10,
//     };
//     setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
//   };

//   const addDesignToForm = async (dp: DesignProjectOption) => {
//     const item: FormPlaylistItem = {
//       tempId: Date.now() + Math.random(), media_id: null, design_project_id: dp.id,
//       item_type: "design_project", item_name: dp.name, item_sub_type: "design",
//       duration: 15,
//     };
//     setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
//   };

//   const addWidgetToForm = (widget: WidgetOption) => {
//     const item: FormPlaylistItem = {
//       tempId: Date.now() + Math.random(), media_id: widget.id, design_project_id: null,
//       item_type: "widget", item_name: widget.name, item_sub_type: "widget",
//       duration: 15,
//     };
//     setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
//   };

//   const removeItemFromForm = (tempId: number) => { setForm((prev) => ({ ...prev, items: prev.items.filter((i) => i.tempId !== tempId) })); };
//   const updateItemDuration = (tempId: number, duration: number) => { setForm((prev) => ({ ...prev, items: prev.items.map((i) => i.tempId === tempId ? { ...i, duration: Math.max(1, duration) } : i) })); };
//   const moveItem = (index: number, direction: "up" | "down") => {
//     const newItems = [...form.items]; const targetIndex = direction === "up" ? index - 1 : index + 1;
//     if (targetIndex < 0 || targetIndex >= newItems.length) return;
//     [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
//     setForm((prev) => ({ ...prev, items: newItems }));
//   };
//   const handleDragStart = (index: number) => { setDragIndex(index); };
//   const handleDragOver = (e: React.DragEvent, index: number) => {
//     e.preventDefault(); if (dragIndex === null || dragIndex === index) return;
//     const newItems = [...form.items]; const [dragged] = newItems.splice(dragIndex, 1); newItems.splice(index, 0, dragged);
//     setForm((prev) => ({ ...prev, items: newItems })); setDragIndex(index);
//   };
//   const handleDragEnd = () => { setDragIndex(null); };
//   const toggleDay = (day: string) => { setForm((prev) => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day] })); };

//   const totalDuration = (items: { duration: number }[]) => items.reduce((sum, i) => sum + i.duration, 0);
//   const formatDuration = (secs: number) => {
//     const m = Math.floor(secs / 60); const s = secs % 60;
//     return m > 0 ? `${m}${t("durationMin")}${s > 0 ? `${s}${t("durationSec")}` : ""}` : `${s}${t("durationSec")}`;
//   };

//   return (
//     <div className="space-y-6 max-w-6xl">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">{t("schedTitle")}</h1>
//           <p className="text-sm text-muted-foreground mt-1">{t("schedSubtitle")}</p>
//         </div>
//         <div className="flex items-center gap-2 self-start">
//           {isAdmin && orgs.length > 1 && (
//             <Select value={filterOrgId} onValueChange={setFilterOrgId}>
//               <SelectTrigger className="w-[180px] h-9">
//                 <Building2 className="w-4 h-4 mr-1.5 text-muted-foreground" />
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">{t("orgFilterAll")}</SelectItem>
//                 {orgs.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
//                 <SelectItem value="none">— 未分配 —</SelectItem>
//               </SelectContent>
//             </Select>
//           )}
//           {isAdmin && (
//             <div className="flex items-center gap-2">
//               <Button onClick={openAdd} className="gap-2">
//                 <Plus className="w-4 h-4" />
//                 {t("schedAdd")}
//               </Button>

//               <Button onClick={openAdd} className="gap-2">
//                 <Plus className="w-4 h-4" />
//                 新增事件
//               </Button>
//             </div>
//           )}

//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
//       ) : (
//         <>
//           {filteredSchedules.length === 0 && (
//             <Card className="p-12 text-center text-muted-foreground">
//               <CalendarClock className="w-10 h-10 mx-auto mb-3 opacity-40" />
//               <p>{t("schedNoResult")}</p>
//             </Card>
//           )}

//           <div className="grid gap-4">
//             {filteredSchedules.map((schedule, i) => (
//               <div key={schedule.id} className={`opacity-0 animate-fade-in stagger-${Math.min(i + 1, 8)} ${!schedule.enabled ? "[&>*]:opacity-60" : ""}`}>
//                 <Card className="hover-lift shadow-sm">
//                   <div className="p-4 flex items-start gap-4">
//                     <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
//                       <CalendarClock className="w-5 h-5 text-muted-foreground/60" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <h3 className="text-sm font-semibold text-foreground">{schedule.name}</h3>
//                         <Badge variant={schedule.enabled ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
//                           {schedule.enabled ? t("enabled") : t("disabled")}
//                         </Badge>
//                       </div>
//                       <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
//                         <span className="flex items-center gap-1"><Monitor className="w-3 h-3" />{schedule.screen_label}</span>
//                         <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{schedule.start_time} - {schedule.end_time}</span>
//                         <span className="flex items-center gap-1"><Play className="w-3 h-3" />{schedule.items.length} {t("schedItems")} · {formatDuration(totalDuration(schedule.items))}</span>
//                       </div>
//                       {!!schedule.start_date || !!schedule.end_date ? (
//                         <div className="mt-2">
//                           <span className="inline-flex rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
//                             {schedule.start_date || "—"} ~ {schedule.end_date || "—"}
//                           </span>
//                         </div>
//                       ) : (
//                         <div className="flex gap-1 mt-2">
//                           {allDaysRaw.map((day, di) => (
//                             <span key={day} className={`w-6 h-6 rounded text-[10px] font-medium flex items-center justify-center ${schedule.days.includes(day) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/40"
//                               }`}>{dayLabels[di]}</span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2 shrink-0">
//                       {isAdmin && <Switch checked={schedule.enabled} onCheckedChange={() => toggleEnabled(schedule.id, schedule.enabled)} />}
//                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(expandedId === schedule.id ? null : schedule.id)} title={t("schedPlayOrder")}>
//                         {expandedId === schedule.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                       </Button>
//                       {isAdmin && (
//                         <>
//                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(schedule)} title={t("schedEditTitle")}><Pencil className="w-4 h-4" /></Button>
//                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(schedule.id)} title={t("schedDeleted")}><Trash2 className="w-4 h-4" /></Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   {expandedId === schedule.id && (
//                     <div className="border-t border-border px-4 py-3 bg-muted/30">
//                       <p className="text-xs text-muted-foreground mb-2 font-medium">{t("schedPlayOrder")}</p>
//                       <div className="space-y-1.5">
//                         {schedule.items.map((item, index) => (
//                           <div key={item.id} className="flex items-center gap-3 bg-card rounded-lg px-3 py-2 text-sm">
//                             <span className="text-muted-foreground text-xs w-5 text-center">{index + 1}</span>
//                             <ItemIcon subType={item.item_sub_type} />
//                             <span className="flex-1 truncate text-foreground">{item.item_name}</span>
//                             {item.item_sub_type === "design" && <Badge variant="secondary" className="text-[9px] px-1 py-0">{t("schedTabDesign")}</Badge>}
//                             {item.item_sub_type === "widget" && <Badge variant="outline" className="text-[9px] px-1 py-0">{t("schedTabWidget")}</Badge>}
//                             <span className="text-xs text-muted-foreground">{item.duration}{t("seconds")}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </Card>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle>{editingId ? t("schedEditTitle") : t("schedAddTitle")}</DialogTitle></DialogHeader>
//           <div className="space-y-5 py-2">
//             <div className="space-y-2">
//               <Label>{t("schedName")} *</Label>
//               <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("schedNamePlaceholder")} />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div className="space-y-2">
//                 <Label>{t("schedScreen")} *</Label>
//                 <Select
//                   value={form.screen_id || undefined}
//                   onValueChange={(v) => {
//                     const selectedScreen = screenOptions.find((screen) => screen.id === v);
//                     setForm((prev) => ({
//                       ...prev,
//                       screen_id: v,
//                       screen_group: selectedScreen?.groupLabel || prev.screen_group,
//                     }));
//                   }}
//                 >
//                   <SelectTrigger><SelectValue placeholder={t("schedSelectScreen")} /></SelectTrigger>
//                   <SelectContent>{filteredScreenOptions.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>設備群組</Label>
//                 <Select
//                   value={form.screen_group}
//                   onValueChange={(value) => {
//                     setForm((prev) => {
//                       const nextScreens = value === "all"
//                         ? screenOptions
//                         : screenOptions.filter((screen) => screen.groupLabel === value);
//                       const keepScreen = nextScreens.some((screen) => screen.id === prev.screen_id);
//                       return {
//                         ...prev,
//                         screen_group: value,
//                         screen_id: keepScreen ? prev.screen_id : "",
//                       };
//                     });
//                   }}
//                 >
//                   <SelectTrigger><SelectValue placeholder="選擇設備群組" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">全部群組</SelectItem>
//                     {deviceGroupOptions.map((group) => <SelectItem key={group.id} value={group.id}>{group.label}</SelectItem>)}
//                   </SelectContent>
//                 </Select>
//                 <p className="text-[11px] text-muted-foreground">可先依設備群組篩選，再指定要派送的螢幕。</p>
//               </div>
//             </div>
//             '
//             <div className="space-y-3">
//               <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
//                 <Label htmlFor="enable-calendar" className="text-sm font-medium">啟用日曆</Label>
//                 <Switch
//                   id="enable-calendar"
//                   checked={form.enableCalendar}
//                   onCheckedChange={(checked) =>
//                     setForm((prev) => ({
//                       ...prev,
//                       enableCalendar: checked,
//                       startDate: checked ? prev.startDate : "",
//                       endDate: checked ? prev.endDate : "",
//                     }))
//                   }
//                 />
//               </div>

//               {form.enableCalendar && (
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="space-y-2">
//                     <Label>開始日期</Label>
//                     <Input
//                       type="date"
//                       value={form.startDate}
//                       onChange={(e) => setForm({ ...form, startDate: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>結束日期</Label>
//                     <Input
//                       type="date"
//                       value={form.endDate}
//                       onChange={(e) => setForm({ ...form, endDate: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label>{t("schedPlayDays")}</Label>
//                 <div className="flex gap-2 flex-wrap">
//                   {allDaysRaw.map((day, di) => (
//                     <button
//                       key={day}
//                       type="button"
//                       onClick={() => toggleDay(day)}
//                       className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${form.days.includes(day) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
//                         }`}
//                     >
//                       {dayLabels[di]}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-2"><Label>{t("schedStartTime")}</Label><Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></div>
//                 <div className="space-y-2"><Label>{t("schedEndTime")}</Label><Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></div>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>{t("schedPlaylist")}</Label>
//                 <span className="text-xs text-muted-foreground">{form.items.length} {t("schedItems")} · {formatDuration(totalDuration(form.items))}</span>
//               </div>
//               <div className="space-y-1.5 min-h-[40px]">
//                 {form.items.length === 0 && <div className="text-center text-sm text-muted-foreground py-4 bg-muted/50 rounded-lg">{t("schedFromBelow")}</div>}
//                 {form.items.map((item, index) => (
//                   <div key={item.tempId} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd}
//                     className={`flex items-center gap-2 bg-card border border-border rounded-lg px-2 py-1.5 text-sm group transition-colors ${dragIndex === index ? "opacity-50 border-primary" : ""}`}>
//                     <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0" />
//                     <span className="text-muted-foreground text-xs w-4 text-center shrink-0">{index + 1}</span>
//                     <SmallItemIcon subType={item.item_sub_type} />
//                     <span className="flex-1 truncate text-foreground text-xs">{item.item_name}</span>
//                     <div className="flex items-center gap-1 shrink-0">
//                       <Input type="number" min={1} value={item.duration} onChange={(e) => updateItemDuration(item.tempId, parseInt(e.target.value) || 1)} className="w-14 h-7 text-xs text-center" />
//                       <span className="text-[10px] text-muted-foreground">{t("seconds")}</span>
//                     </div>
//                     <div className="flex shrink-0">
//                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, "up")} disabled={index === 0} title={t("tipMoveUp")}><ChevronUp className="w-3 h-3" /></Button>
//                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, "down")} disabled={index === form.items.length - 1} title={t("tipMoveDown")}><ChevronDown className="w-3 h-3" /></Button>
//                     </div>
//                     <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive shrink-0" onClick={() => removeItemFromForm(item.tempId)} title={t("delete")}><X className="w-3 h-3" /></Button>
//                   </div>
//                 ))}
//               </div>
//               <div className="border-t border-border pt-3 mt-3">
//                 <div className="flex items-center justify-between gap-3 mb-2">
//                   <p className="text-xs text-muted-foreground">{t("schedClickToAdd")}</p>
//                   <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer whitespace-nowrap">
//                     <input
//                       type="checkbox"
//                       checked={form.joinDefaultSchedule}
//                       onChange={(e) => setForm({ ...form, joinDefaultSchedule: e.target.checked })}
//                       className="h-4 w-4 rounded border-border"
//                     />
//                     <span>加入預設排程</span>
//                   </label>
//                 </div>
//                 <Tabs defaultValue="media" className="w-full">
//                   <TabsList className="grid w-full grid-cols-3 h-8">
//                     <TabsTrigger value="media" className="text-xs gap-1"><FileImage className="w-3 h-3" />{t("schedTabMedia")}</TabsTrigger>
//                     <TabsTrigger value="design" className="text-xs gap-1"><Layers className="w-3 h-3" />{t("schedTabDesign")}</TabsTrigger>
//                     <TabsTrigger value="widget" className="text-xs gap-1"><Code2 className="w-3 h-3" />{t("schedTabWidget")}</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="media" className="mt-2">
//                     {mediaOptions.length === 0 ? (
//                       <p className="text-xs text-muted-foreground text-center py-2">{t("mediaNoResult")}</p>
//                     ) : (
//                       <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
//                         {mediaOptions.map((media) => (
//                           <button key={media.id} type="button" onClick={() => addMediaToForm(media)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors">
//                             {media.type === "image" ? <FileImage className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <FileVideo className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
//                             <span className="truncate text-xs text-foreground">{media.name}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </TabsContent>
//                   <TabsContent value="design" className="mt-2">
//                     {designOptions.length === 0 ? (
//                       <p className="text-xs text-muted-foreground text-center py-2">{t("studioNoProjects")}</p>
//                     ) : (
//                       <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
//                         {designOptions.map((dp) => (
//                           <button key={dp.id} type="button" onClick={() => addDesignToForm(dp)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors">
//                             <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
//                             <div className="truncate">
//                               <span className="text-xs text-foreground block truncate">{dp.name}</span>
//                               <span className="text-[10px] text-muted-foreground">{dp.aspect}</span>
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </TabsContent>
//                   <TabsContent value="widget" className="mt-2">
//                     {widgetOptions.length === 0 ? (
//                       <p className="text-xs text-muted-foreground text-center py-2">{t("mediaNoResult")}</p>
//                     ) : (
//                       <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
//                         {widgetOptions.map((w) => (
//                           <button key={w.id} type="button" onClick={() => addWidgetToForm(w)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors">
//                             <Code2 className="w-3.5 h-3.5 text-accent-foreground shrink-0" />
//                             <span className="truncate text-xs text-foreground">{w.name}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </TabsContent>
//                 </Tabs>
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <DialogClose asChild><Button variant="outline">{t("cancel")}</Button></DialogClose>
//             <Button onClick={handleSave} disabled={saving}>
//               {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//               {editingId ? t("schedSaveChanges") : t("schedAdd")}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>{t("schedDeleteConfirm")}</AlertDialogTitle>
//             <AlertDialogDescription>{t("schedDeleteDesc")}</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t("confirmDelete")}</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useUserOrgs } from "@/hooks/useUserOrgs";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CalendarClock,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Play,
  Clock,
  Monitor,
  FileImage,
  FileVideo,
  X,
  Loader2,
  Layers,
  Code2,
  Building2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { mockScreens } from "@/mock/screensMockData";
import * as mediaMockModule from "@/mock/mediaMockData";
import { mockSchedules } from "@/mock/schedulesMockData";

type PlaylistItemType = "media" | "design_project" | "widget";
type EntryType = "schedule" | "event";

type EventTriggerType = "once" | "repeat" | "hold";
type EventSourceType = "gpio" | "api" | "keyboard" | "mouse" | "touch" | "remote";
type ApiOperator = "=" | ">" | "<" | ">=" | "<=" | "!=";
type MouseButtonType = "left" | "middle" | "right";
type MouseActionType = "click" | "dblclick";
type TouchModeType = "split" | "overlay" | "swipe";

interface EventConfig {
  triggerType: EventTriggerType;
  repeatCount: string;
  sourceType: EventSourceType;

  gpioPin: string;
  gpioPins: string[];

  apiUrl: string;
  apiRegex: string;
  apiOperator: ApiOperator;
  apiValue: string;

  keyboardKey: string;
  remoteKey: string;

  mouseRect: string;
  mouseButton: MouseButtonType;
  mouseAction: MouseActionType;

  touchMode: TouchModeType;
  touchTargetId: string;
}

interface PlaylistItem {
  id: string;
  media_id: string | null;
  design_project_id: string | null;
  item_type: PlaylistItemType;
  item_name: string;
  item_sub_type: "image" | "video" | "design" | "widget";
  duration: number;
  sort_order: number;
}

interface Schedule {
  id: string;
  entry_type: EntryType;
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
  items: PlaylistItem[];
  event_config?: EventConfig | null;
}

interface ScreenOption {
  id: string;
  label: string;
  groupLabel: string;
}
interface DeviceGroupOption {
  id: string;
  label: string;
}
interface MediaOption {
  id: string;
  name: string;
  type: "image" | "video" | "widget";
}
interface DesignProjectOption {
  id: string;
  name: string;
  aspect: string;
}
interface WidgetOption {
  id: string;
  name: string;
}

interface FormPlaylistItem {
  tempId: number;
  media_id: string | null;
  design_project_id: string | null;
  item_type: PlaylistItemType;
  item_name: string;
  item_sub_type: "image" | "video" | "design" | "widget";
  duration: number;
}

type RawMockMediaItem = Record<string, any>;

function normalizeMockMediaType(
  value: any,
  item?: RawMockMediaItem
): "image" | "video" | "widget" {
  const raw = String(
    value ??
    item?.type ??
    item?.media_type ??
    item?.item_type ??
    item?.sub_type ??
    item?.category ??
    item?.kind ??
    item?.file_type ??
    item?.mime_type ??
    ""
  ).toLowerCase();

  if (raw.includes("widget")) return "widget";
  if (
    raw.includes("video") ||
    raw.includes("mp4") ||
    raw.includes("mov") ||
    raw.includes("webm")
  ) {
    return "video";
  }
  return "image";
}

function extractMockMediaOptions(): { media: MediaOption[]; widgets: WidgetOption[] } {
  const moduleCandidate = mediaMockModule as Record<string, any>;
  const directArray = Array.isArray(moduleCandidate.default)
    ? moduleCandidate.default
    : Array.isArray(moduleCandidate.mockMedia)
      ? moduleCandidate.mockMedia
      : Array.isArray(moduleCandidate.mockMediaData)
        ? moduleCandidate.mockMediaData
        : Array.isArray(moduleCandidate.mediaMockData)
          ? moduleCandidate.mediaMockData
          : Array.isArray(moduleCandidate.mediaItems)
            ? moduleCandidate.mediaItems
            : null;

  const inferredArray =
    directArray ||
    Object.values(moduleCandidate).find(
      (value) => Array.isArray(value) && value.every((item) => item && typeof item === "object")
    );

  const rawList = (Array.isArray(inferredArray) ? inferredArray : []) as RawMockMediaItem[];

  const normalized = rawList.map((item, index) => {
    const id = String(item.id ?? item.media_id ?? item.uuid ?? item.key ?? `mock-media-${index + 1}`);
    const name = String(
      item.name ?? item.title ?? item.file_name ?? item.filename ?? item.label ?? `素材 ${index + 1}`
    );
    const type = normalizeMockMediaType(item.type, item);
    return { id, name, type };
  });

  return {
    media: normalized.filter((item) => item.type !== "widget"),
    widgets: normalized
      .filter((item) => item.type === "widget")
      .map((item) => ({ id: item.id, name: item.name })),
  };
}

function ItemIcon({ subType }: { subType: "image" | "video" | "design" | "widget" }) {
  if (subType === "design") return <Layers className="w-4 h-4 text-primary shrink-0" />;
  if (subType === "widget") return <Code2 className="w-4 h-4 text-accent-foreground shrink-0" />;
  if (subType === "video") return <FileVideo className="w-4 h-4 text-muted-foreground shrink-0" />;
  return <FileImage className="w-4 h-4 text-muted-foreground shrink-0" />;
}

function SmallItemIcon({ subType }: { subType: "image" | "video" | "design" | "widget" }) {
  if (subType === "design") return <Layers className="w-3.5 h-3.5 text-primary shrink-0" />;
  if (subType === "widget") return <Code2 className="w-3.5 h-3.5 text-accent-foreground shrink-0" />;
  if (subType === "video") return <FileVideo className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
  return <FileImage className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
}

const createDefaultEventConfig = (): EventConfig => ({
  triggerType: "once",
  repeatCount: "",
  sourceType: "touch",

  gpioPin: "1",
  gpioPins: ["1"],

  apiUrl: "",
  apiRegex: "",
  apiOperator: "=",
  apiValue: "",

  keyboardKey: "Enter",
  remoteKey: "F1",

  mouseRect: "10,20,100,50",
  mouseButton: "left",
  mouseAction: "click",

  touchMode: "split",
  touchTargetId: "",
});

export default function SchedulesPage() {
  const { isAdmin } = useUserRole();
  const { t } = useLanguage();
  const { orgs, defaultOrgId } = useUserOrgs();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [screenOptions, setScreenOptions] = useState<ScreenOption[]>([]);
  const [deviceGroupOptions, setDeviceGroupOptions] = useState<DeviceGroupOption[]>([]);
  const [mediaOptions, setMediaOptions] = useState<MediaOption[]>([]);
  const [widgetOptions, setWidgetOptions] = useState<WidgetOption[]>([]);
  const [designOptions, setDesignOptions] = useState<DesignProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<EntryType>("schedule");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [filterOrgId, setFilterOrgId] = useState<string>("all");

  const createEmptyForm = () => ({
    enableCalendar: false,
    name: "",
    screen_group: "all",
    screen_id: "",
    startTime: "09:00",
    endTime: "18:00",
    days: ["一", "二", "三", "四", "五"] as string[],
    startDate: "",
    endDate: "",
    items: [] as FormPlaylistItem[],
    joinDefaultSchedule: false,
    eventConfig: createDefaultEventConfig(),
  });

  const [form, setForm] = useState(createEmptyForm);

  const dayKeys = ["dayMon", "dayTue", "dayWed", "dayThu", "dayFri", "daySat", "daySun"] as const;
  const allDaysRaw = ["一", "二", "三", "四", "五", "六", "日"];
  const dayLabels = dayKeys.map((k) => t(k));

  const buildScreenOptions = () => {
    const screenMapById = new Map<string, ScreenOption>();

    (mockScreens || []).forEach((s) => {
      const branch = s.branch?.trim() || "未分館";
      const name = s.name?.trim() || `螢幕 ${s.id}`;
      screenMapById.set(String(s.id), {
        id: String(s.id),
        label: `${branch} - ${name}`,
        groupLabel: branch,
      });
    });

    return Array.from(screenMapById.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "zh-Hant")
    );
  };

  const buildDeviceGroupOptions = () => {
    const groupSet = new Set<string>();

    (mockScreens || []).forEach((s) => {
      const branch = s.branch?.trim() || "未分館";
      groupSet.add(branch);
    });

    return Array.from(groupSet)
      .sort((a, b) => a.localeCompare(b, "zh-Hant"))
      .map((group) => ({ id: group, label: group }));
  };

  const buildScheduleScreenLabel = (screenId: string) => {
    const matched = (mockScreens || []).find((screen) => String(screen.id) === String(screenId));
    if (!matched) return "";
    const branch = matched.branch?.trim() || "未分館";
    const name = matched.name?.trim() || `螢幕 ${matched.id}`;
    return `${branch} - ${name}`;
  };

  const buildMockSchedules = (): Schedule[] => {
    return (mockSchedules || []).map((schedule: any) => ({
      ...schedule,
      entry_type: (schedule.entry_type as EntryType) || "schedule",
      screen_id: String(schedule.screen_id),
      screen_label: schedule.screen_label || buildScheduleScreenLabel(String(schedule.screen_id)),
      event_config: schedule.event_config || null,
      items: (schedule.items || []).map((item: any, index: number) => ({
        ...item,
        sort_order: typeof item.sort_order === "number" ? item.sort_order : index,
      })),
    }));
  };

  useEffect(() => {
    setLoading(true);

    setScreenOptions(buildScreenOptions());
    setDeviceGroupOptions(buildDeviceGroupOptions());
    setSchedules(buildMockSchedules());

    const mockMedia = extractMockMediaOptions();
    setMediaOptions(mockMedia.media);
    setWidgetOptions(mockMedia.widgets);

    setDesignOptions([]);
    setLoading(false);
  }, []);

  const createId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const filteredSchedules = useMemo(() => {
    if (filterOrgId === "all") return schedules;
    if (filterOrgId === "none") return schedules.filter((s) => !s.org_id);
    return schedules.filter((s) => s.org_id === filterOrgId);
  }, [schedules, filterOrgId]);

  const filteredScreenOptions = useMemo(() => {
    if (form.screen_group === "all") return screenOptions;
    return screenOptions.filter((screen) => screen.groupLabel === form.screen_group);
  }, [form.screen_group, screenOptions]);

  const openAdd = (mode: EntryType = "schedule") => {
    setEditingId(null);
    setDialogMode(mode);
    setForm(createEmptyForm());
    setDialogOpen(true);
  };

  const openEdit = (s: Schedule) => {
    const isCalendarMode = !!s.start_date || !!s.end_date;
    const nextMode: EntryType = s.entry_type || "schedule";

    setEditingId(s.id);
    setDialogMode(nextMode);
    setForm({
      enableCalendar: nextMode === "schedule" ? isCalendarMode : false,
      name: s.name,
      screen_group: screenOptions.find((screen) => screen.id === s.screen_id)?.groupLabel || "all",
      screen_id: s.screen_id,
      startTime: s.start_time,
      endTime: s.end_time,
      days: [...s.days],
      startDate: s.start_date || "",
      endDate: s.end_date || "",
      joinDefaultSchedule: false,
      eventConfig: s.event_config
        ? {
          ...createDefaultEventConfig(),
          ...s.event_config,
        }
        : createDefaultEventConfig(),
      items: s.items.map((i) => ({
        tempId: Math.random(),
        media_id: i.media_id,
        design_project_id: i.design_project_id,
        item_type: i.item_type,
        item_name: i.item_name,
        item_sub_type: i.item_sub_type,
        duration: i.duration,
      })),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.screen_id) {
      toast.error(t("schedFillRequired"));
      return;
    }

    if (form.items.length === 0) {
      toast.error(t("schedAddItem"));
      return;
    }

    if (dialogMode === "schedule" && form.days.length === 0) {
      toast.error(t("schedPlayDays"));
      return;
    }

    if (dialogMode === "schedule" && form.enableCalendar && (!form.startDate || !form.endDate)) {
      toast.error("請選擇起訖日期");
      return;
    }

    if (dialogMode === "schedule" && form.enableCalendar && form.startDate > form.endDate) {
      toast.error("結束日期不可早於開始日期");
      return;
    }

    if (dialogMode === "event") {
      const ec = form.eventConfig;

      if (ec.triggerType === "repeat" && !ec.repeatCount.trim()) {
        toast.error("請輸入多次觸發的次數");
        return;
      }

      if (ec.sourceType === "gpio") {
        if (ec.gpioPins.length === 0 || ec.gpioPins.every((p) => !p.trim())) {
          toast.error("請至少填寫一個 GPIO Pin 編號");
          return;
        }
      }

      if (ec.sourceType === "api" && !ec.apiUrl.trim()) {
        toast.error("請輸入 API 端點 URL");
        return;
      }

      if (ec.sourceType === "keyboard" && !ec.keyboardKey.trim()) {
        toast.error("請選擇按鍵代碼");
        return;
      }

      if (ec.sourceType === "remote" && !ec.remoteKey.trim()) {
        toast.error("請選擇遙控器按鍵");
        return;
      }

      if (ec.sourceType === "mouse" && !ec.mouseRect.trim()) {
        toast.error("請輸入滑鼠觸發區域");
        return;
      }

      if (
        ec.sourceType === "touch" &&
        (ec.touchMode === "split" || ec.touchMode === "overlay") &&
        !ec.touchTargetId.trim()
      ) {
        toast.error("請輸入觸控目標 ID");
        return;
      }
    }

    setSaving(true);

    const selectedScreen = screenOptions.find((screen) => screen.id === form.screen_id);
    const nextItems: PlaylistItem[] = form.items.map((item, index) => ({
      id: createId(),
      media_id: item.media_id,
      design_project_id: item.design_project_id,
      item_type: item.item_type,
      item_name: item.item_name,
      item_sub_type: item.item_sub_type,
      duration: item.duration,
      sort_order: index,
    }));

    const nextSchedule: Schedule = {
      id: editingId || createId(),
      entry_type: dialogMode,
      name: form.name,
      org_id: defaultOrgId || null,
      screen_id: form.screen_id,
      screen_label: selectedScreen?.label || "",
      start_time: dialogMode === "schedule" ? form.startTime : "",
      end_time: dialogMode === "schedule" ? form.endTime : "",
      days: dialogMode === "schedule" ? form.days : [],
      start_date: dialogMode === "schedule" && form.enableCalendar ? form.startDate : null,
      end_date: dialogMode === "schedule" && form.enableCalendar ? form.endDate : null,
      enabled: true,
      items: nextItems,
      event_config: dialogMode === "event" ? { ...form.eventConfig } : null,
    };

    if (editingId) {
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === editingId
            ? { ...nextSchedule, enabled: schedule.enabled, org_id: schedule.org_id }
            : schedule
        )
      );
      toast.success(dialogMode === "event" ? "事件已更新" : t("schedUpdated"));
    } else {
      setSchedules((prev) => [...prev, nextSchedule]);
      toast.success(dialogMode === "event" ? "事件已新增" : t("schedAdded"));
    }

    setSaving(false);
    setDialogOpen(false);
    setEditingId(null);
    setDialogMode("schedule");
    setForm(createEmptyForm());
  };

  const handleDelete = async () => {
    if (deleteId) {
      setSchedules((prev) => prev.filter((schedule) => schedule.id !== deleteId));
      toast.success(t("schedDeleted"));
      setDeleteId(null);
      if (expandedId === deleteId) setExpandedId(null);
    }
  };

  const toggleEnabled = async (id: string, current: boolean) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id ? { ...schedule, enabled: !current } : schedule
      )
    );
  };

  const addMediaToForm = (media: MediaOption) => {
    const item: FormPlaylistItem = {
      tempId: Date.now() + Math.random(),
      media_id: media.id,
      design_project_id: null,
      item_type: "media",
      item_name: media.name,
      item_sub_type: media.type,
      duration: media.type === "video" ? 30 : 10,
    };
    setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
  };

  const addDesignToForm = async (dp: DesignProjectOption) => {
    const item: FormPlaylistItem = {
      tempId: Date.now() + Math.random(),
      media_id: null,
      design_project_id: dp.id,
      item_type: "design_project",
      item_name: dp.name,
      item_sub_type: "design",
      duration: 15,
    };
    setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
  };

  const addWidgetToForm = (widget: WidgetOption) => {
    const item: FormPlaylistItem = {
      tempId: Date.now() + Math.random(),
      media_id: widget.id,
      design_project_id: null,
      item_type: "widget",
      item_name: widget.name,
      item_sub_type: "widget",
      duration: 15,
    };
    setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
  };

  const removeItemFromForm = (tempId: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.tempId !== tempId),
    }));
  };

  const updateItemDuration = (tempId: number, duration: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.tempId === tempId ? { ...i, duration: Math.max(1, duration) } : i
      ),
    }));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...form.items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setForm((prev) => ({ ...prev, items: newItems }));
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newItems = [...form.items];
    const [dragged] = newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, dragged);
    setForm((prev) => ({ ...prev, items: newItems }));
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const totalDuration = (items: { duration: number }[]) =>
    items.reduce((sum, i) => sum + i.duration, 0);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0
      ? `${m}${t("durationMin")}${s > 0 ? `${s}${t("durationSec")}` : ""}`
      : `${s}${t("durationSec")}`;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("schedTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("schedSubtitle")}</p>
        </div>

        <div className="flex items-center gap-2 self-start">
          {isAdmin && orgs.length > 1 && (
            <Select value={filterOrgId} onValueChange={setFilterOrgId}>
              <SelectTrigger className="w-[180px] h-9">
                <Building2 className="w-4 h-4 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("orgFilterAll")}</SelectItem>
                {orgs.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
                <SelectItem value="none">— 未分配 —</SelectItem>
              </SelectContent>
            </Select>
          )}

          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button onClick={() => openAdd("schedule")} className="gap-2">
                <Plus className="w-4 h-4" />
                {t("schedAdd")}
              </Button>

              <Button onClick={() => openAdd("event")} className="gap-2">
                <Plus className="w-4 h-4" />
                新增事件
              </Button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {filteredSchedules.length === 0 && (
            <Card className="p-12 text-center text-muted-foreground">
              <CalendarClock className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>{t("schedNoResult")}</p>
            </Card>
          )}

          <div className="grid gap-4">
            {filteredSchedules.map((schedule, i) => (
              <div
                key={schedule.id}
                className={`opacity-0 animate-fade-in stagger-${Math.min(i + 1, 8)} ${!schedule.enabled ? "[&>*]:opacity-60" : ""
                  }`}
              >
                <Card className="hover-lift shadow-sm">
                  <div className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <CalendarClock className="w-5 h-5 text-muted-foreground/60" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">{schedule.name}</h3>

                        {schedule.entry_type === "event" && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-red-500 hover:bg-red-500 text-white border-0">
                            事件
                          </Badge>
                        )}

                        <Badge
                          variant={schedule.enabled ? "default" : "secondary"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {schedule.enabled ? t("enabled") : t("disabled")}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          {schedule.screen_label}
                        </span>

                        {schedule.entry_type === "schedule" && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {schedule.start_time} - {schedule.end_time}
                          </span>
                        )}

                        <span className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {schedule.items.length} {t("schedItems")} · {formatDuration(totalDuration(schedule.items))}
                        </span>
                      </div>

                      {schedule.entry_type === "schedule" &&
                        (!!schedule.start_date || !!schedule.end_date ? (
                          <div className="mt-2">
                            <span className="inline-flex rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                              {schedule.start_date || "—"} ~ {schedule.end_date || "—"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-1 mt-2">
                            {allDaysRaw.map((day, di) => (
                              <span
                                key={day}
                                className={`w-6 h-6 rounded text-[10px] font-medium flex items-center justify-center ${schedule.days.includes(day)
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground/40"
                                  }`}
                              >
                                {dayLabels[di]}
                              </span>
                            ))}
                          </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isAdmin && (
                        <Switch
                          checked={schedule.enabled}
                          onCheckedChange={() => toggleEnabled(schedule.id, schedule.enabled)}
                        />
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setExpandedId(expandedId === schedule.id ? null : schedule.id)}
                        title={t("schedPlayOrder")}
                      >
                        {expandedId === schedule.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>

                      {isAdmin && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(schedule)}
                            title={schedule.entry_type === "event" ? "編輯事件" : t("schedEditTitle")}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(schedule.id)}
                            title={t("schedDeleted")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {expandedId === schedule.id && (
                    <div className="border-t border-border px-4 py-3 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">
                        {schedule.entry_type === "event" ? "事件播放內容" : t("schedPlayOrder")}
                      </p>
                      <div className="space-y-1.5">
                        {schedule.items.map((item, index) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-card rounded-lg px-3 py-2 text-sm"
                          >
                            <span className="text-muted-foreground text-xs w-5 text-center">
                              {index + 1}
                            </span>
                            <ItemIcon subType={item.item_sub_type} />
                            <span className="flex-1 truncate text-foreground">{item.item_name}</span>
                            {item.item_sub_type === "design" && (
                              <Badge variant="secondary" className="text-[9px] px-1 py-0">
                                {t("schedTabDesign")}
                              </Badge>
                            )}
                            {item.item_sub_type === "widget" && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0">
                                {t("schedTabWidget")}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {item.duration}
                              {t("seconds")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? dialogMode === "event"
                  ? "編輯事件"
                  : t("schedEditTitle")
                : dialogMode === "event"
                  ? "新增事件"
                  : t("schedAddTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label>{t("schedName")} *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("schedNamePlaceholder")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t("schedScreen")} *</Label>
                <Select
                  value={form.screen_id || undefined}
                  onValueChange={(v) => {
                    const selectedScreen = screenOptions.find((screen) => screen.id === v);
                    setForm((prev) => ({
                      ...prev,
                      screen_id: v,
                      screen_group: selectedScreen?.groupLabel || prev.screen_group,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("schedSelectScreen")} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredScreenOptions.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>設備群組</Label>
                <Select
                  value={form.screen_group}
                  onValueChange={(value) => {
                    setForm((prev) => {
                      const nextScreens =
                        value === "all"
                          ? screenOptions
                          : screenOptions.filter((screen) => screen.groupLabel === value);
                      const keepScreen = nextScreens.some((screen) => screen.id === prev.screen_id);
                      return {
                        ...prev,
                        screen_group: value,
                        screen_id: keepScreen ? prev.screen_id : "",
                      };
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇設備群組" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部群組</SelectItem>
                    {deviceGroupOptions.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  可先依設備群組篩選，再指定要派送的螢幕。
                </p>
              </div>
            </div>

            {dialogMode === "schedule" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <Label htmlFor="enable-calendar" className="text-sm font-medium">
                    啟用日曆
                  </Label>
                  <Switch
                    id="enable-calendar"
                    checked={form.enableCalendar}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        enableCalendar: checked,
                        startDate: checked ? prev.startDate : "",
                        endDate: checked ? prev.endDate : "",
                      }))
                    }
                  />
                </div>

                {form.enableCalendar && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>開始日期</Label>
                      <Input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>結束日期</Label>
                      <Input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{t("schedPlayDays")}</Label>
                  <div className="flex gap-2 flex-wrap">
                    {allDaysRaw.map((day, di) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${form.days.includes(day)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-accent"
                          }`}
                      >
                        {dayLabels[di]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>{t("schedStartTime")}</Label>
                    <Input
                      type="time"
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("schedEndTime")}</Label>
                    <Input
                      type="time"
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {dialogMode === "event" && (
              <div className="space-y-4 rounded-lg border border-border p-4">
                <h3 className="text-base font-semibold text-foreground">事件觸發設定</h3>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">事件來源</Label>
                  <div className="space-y-2">
                    {[
                      { value: "gpio", label: "GPIO" },
                      { value: "api", label: "API" },
                      { value: "keyboard", label: "按鍵" },
                      { value: "mouse", label: "滑鼠" },
                      { value: "touch", label: "觸控" },
                      { value: "remote", label: "遙控器" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="event-source-type"
                          checked={form.eventConfig.sourceType === option.value}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              eventConfig: {
                                ...prev.eventConfig,
                                sourceType: option.value as EventSourceType,
                              },
                            }))
                          }
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {form.eventConfig.sourceType === "gpio" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">GPIO 設定</Label>
                      <button
                        type="button"
                        disabled={form.eventConfig.gpioPins.length >= 32}
                        className="text-xs px-2 py-1 rounded border border-input bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            eventConfig: {
                              ...prev.eventConfig,
                              gpioPins: [...prev.eventConfig.gpioPins, ""],
                            },
                          }))
                        }
                      >
                        新增
                      </button>
                    </div>

                    <div className="space-y-2">
                      {form.eventConfig.gpioPins.map((pin, index) => (
                        <div key={index} className="flex items-center gap-3 flex-wrap">
                          <div className="grid grid-cols-[80px_1fr] w-[200px]">
                            <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm shrink-0">
                              Pin {index + 1}
                            </div>
                            <Input
                              value={pin}
                              onChange={(e) => {
                                const updated = form.eventConfig.gpioPins.map((p, i) =>
                                  i === index ? e.target.value : p
                                );
                                setForm((prev) => ({
                                  ...prev,
                                  eventConfig: { ...prev.eventConfig, gpioPins: updated },
                                }));
                              }}
                              placeholder="1~32"
                              className="rounded-l-none"
                            />
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="event-trigger-type"
                                checked={form.eventConfig.triggerType === "once"}
                                onChange={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    eventConfig: { ...prev.eventConfig, triggerType: "once" },
                                  }))
                                }
                              />
                              <span>點動模式</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="event-trigger-type"
                                checked={form.eventConfig.triggerType === "hold"}
                                onChange={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    eventConfig: { ...prev.eventConfig, triggerType: "hold" },
                                  }))
                                }
                              />
                              <span>開關模式</span>
                            </label>
                          </div>

                          {form.eventConfig.gpioPins.length > 1 && (
                            <button
                              type="button"
                              className="text-xs px-2 py-1 rounded border border-destructive text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                const updated = form.eventConfig.gpioPins.filter((_, i) => i !== index);
                                setForm((prev) => ({
                                  ...prev,
                                  eventConfig: { ...prev.eventConfig, gpioPins: updated },
                                }));
                              }}
                            >
                              刪除
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {form.eventConfig.sourceType === "api" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">API 設定</Label>

                    <div className="grid grid-cols-[105px_1fr]">
                      <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm">
                        端點 URL
                      </div>
                      <Input
                        value={form.eventConfig.apiUrl}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            eventConfig: { ...prev.eventConfig, apiUrl: e.target.value },
                          }))
                        }
                        placeholder="https://example.com/trigger"
                        className="rounded-l-none"
                      />
                    </div>

                    <div className="grid grid-cols-[105px_1fr]">
                      <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm">
                        正則表示式
                      </div>
                      <Input
                        value={form.eventConfig.apiRegex}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            eventConfig: { ...prev.eventConfig, apiRegex: e.target.value },
                          }))
                        }
                        placeholder="e.g. ^\\d+$"
                        className="rounded-l-none"
                      />
                    </div>

                    <div className="grid grid-cols-[105px_1fr] max-w-sm">
                      <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm">
                        操作
                      </div>
                      <Select
                        value={form.eventConfig.apiOperator}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            eventConfig: {
                              ...prev.eventConfig,
                              apiOperator: value as ApiOperator,
                            },
                          }))
                        }
                      >
                        <SelectTrigger className="rounded-l-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="=">=</SelectItem>
                          <SelectItem value=">">&gt;</SelectItem>
                          <SelectItem value="<">&lt;</SelectItem>
                          <SelectItem value=">=">&gt;=</SelectItem>
                          <SelectItem value="<=">&lt;=</SelectItem>
                          <SelectItem value="!=">!=</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-[105px_1fr] max-w-sm">
                      <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm">
                        數值
                      </div>
                      <Input
                        value={form.eventConfig.apiValue}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            eventConfig: { ...prev.eventConfig, apiValue: e.target.value },
                          }))
                        }
                        placeholder="e.g. 100"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                )}

                {form.eventConfig.sourceType === "keyboard" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">按鍵設定</Label>
                    <div className="grid grid-cols-[105px_1fr] max-w-xs">
                      <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm">
                        按鍵代碼
                      </div>
                      <Select
                        value={form.eventConfig.keyboardKey}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            eventConfig: { ...prev.eventConfig, keyboardKey: value },
                          }))
                        }
                      >
                        <SelectTrigger className="rounded-l-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Enter">Enter</SelectItem>
                          <SelectItem value="Space">Space</SelectItem>
                          <SelectItem value="ArrowUp">ArrowUp</SelectItem>
                          <SelectItem value="ArrowDown">ArrowDown</SelectItem>
                          <SelectItem value="ArrowLeft">ArrowLeft</SelectItem>
                          <SelectItem value="ArrowRight">ArrowRight</SelectItem>
                          <SelectItem value="Escape">Escape</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {form.eventConfig.sourceType === "remote" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">遙控器設定</Label>
                    <div className="grid grid-cols-[105px_1fr] max-w-xs">
                      <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm">
                        按鍵代碼
                      </div>
                      <Select
                        value={form.eventConfig.remoteKey}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            eventConfig: { ...prev.eventConfig, remoteKey: value },
                          }))
                        }
                      >
                        <SelectTrigger className="rounded-l-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="F1">F1</SelectItem>
                          <SelectItem value="F2">F2</SelectItem>
                          <SelectItem value="F3">F3</SelectItem>
                          <SelectItem value="F4">F4</SelectItem>
                          <SelectItem value="F5">F5</SelectItem>
                          <SelectItem value="F6">F6</SelectItem>
                          <SelectItem value="F7">F7</SelectItem>
                          <SelectItem value="F8">F8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {form.eventConfig.sourceType === "mouse" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">滑鼠設定</Label>
                    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-2">
                      <div className="grid grid-cols-[130px_1fr]">
                        <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm">
                          Rect (X,Y,W,H)
                        </div>
                        <Input
                          value={form.eventConfig.mouseRect}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              eventConfig: { ...prev.eventConfig, mouseRect: e.target.value },
                            }))
                          }
                          placeholder="10,20,100,50"
                          className="rounded-l-none"
                        />
                      </div>

                      <div className="grid grid-cols-[90px_1fr]">
                        <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm">
                          按鈕
                        </div>
                        <Select
                          value={form.eventConfig.mouseButton}
                          onValueChange={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              eventConfig: {
                                ...prev.eventConfig,
                                mouseButton: value as MouseButtonType,
                              },
                            }))
                          }
                        >
                          <SelectTrigger className="rounded-l-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">左</SelectItem>
                            <SelectItem value="middle">中</SelectItem>
                            <SelectItem value="right">右</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-[90px_1fr]">
                        <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm">
                          點擊種類
                        </div>
                        <Select
                          value={form.eventConfig.mouseAction}
                          onValueChange={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              eventConfig: {
                                ...prev.eventConfig,
                                mouseAction: value as MouseActionType,
                              },
                            }))
                          }
                        >
                          <SelectTrigger className="rounded-l-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="click">點擊</SelectItem>
                            <SelectItem value="dblclick">雙擊</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {form.eventConfig.sourceType === "touch" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">觸控設定</Label>

                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="touch-mode"
                          checked={form.eventConfig.touchMode === "split"}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              eventConfig: { ...prev.eventConfig, touchMode: "split" },
                            }))
                          }
                        />
                        <span>分割區 ID</span>
                      </label>

                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="touch-mode"
                          checked={form.eventConfig.touchMode === "overlay"}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              eventConfig: { ...prev.eventConfig, touchMode: "overlay" },
                            }))
                          }
                        />
                        <span>覆蓋區 ID</span>
                      </label>

                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="touch-mode"
                          checked={form.eventConfig.touchMode === "swipe"}
                          onChange={() =>
                            setForm((prev) => ({
                              ...prev,
                              eventConfig: { ...prev.eventConfig, touchMode: "swipe" },
                            }))
                          }
                        />
                        <span>滑動</span>
                      </label>
                    </div>

                    {(form.eventConfig.touchMode === "split" ||
                      form.eventConfig.touchMode === "overlay") && (
                        <div className="grid grid-cols-[105px_1fr] max-w-sm">
                          <div className="h-10 border border-r-0 border-input bg-muted px-3 flex items-center text-sm">
                            {form.eventConfig.touchMode === "split" ? "分割區 ID" : "覆蓋區 ID"}
                          </div>
                          <Input
                            value={form.eventConfig.touchTargetId}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                eventConfig: { ...prev.eventConfig, touchTargetId: e.target.value },
                              }))
                            }
                            placeholder={
                              form.eventConfig.touchMode === "split" ? "e.g. header" : "e.g. overlay-1"
                            }
                            className="rounded-l-none"
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("schedPlaylist")}</Label>
                <span className="text-xs text-muted-foreground">
                  {form.items.length} {t("schedItems")} · {formatDuration(totalDuration(form.items))}
                </span>
              </div>

              <div className="space-y-1.5 min-h-[40px]">
                {form.items.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4 bg-muted/50 rounded-lg">
                    {t("schedFromBelow")}
                  </div>
                )}

                {form.items.map((item, index) => (
                  <div
                    key={item.tempId}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-2 bg-card border border-border rounded-lg px-2 py-1.5 text-sm group transition-colors ${dragIndex === index ? "opacity-50 border-primary" : ""
                      }`}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0" />
                    <span className="text-muted-foreground text-xs w-4 text-center shrink-0">{index + 1}</span>
                    <SmallItemIcon subType={item.item_sub_type} />
                    <span className="flex-1 truncate text-foreground text-xs">{item.item_name}</span>

                    <div className="flex items-center gap-1 shrink-0">
                      <Input
                        type="number"
                        min={1}
                        value={item.duration}
                        onChange={(e) => updateItemDuration(item.tempId, parseInt(e.target.value) || 1)}
                        className="w-14 h-7 text-xs text-center"
                      />
                      <span className="text-[10px] text-muted-foreground">{t("seconds")}</span>
                    </div>

                    <div className="flex shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveItem(index, "up")}
                        disabled={index === 0}
                        title={t("tipMoveUp")}
                      >
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveItem(index, "down")}
                        disabled={index === form.items.length - 1}
                        title={t("tipMoveDown")}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive shrink-0"
                      onClick={() => removeItemFromForm(item.tempId)}
                      title={t("delete")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 mt-3">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs text-muted-foreground">
                    {dialogMode === "event" ? "點擊加入事件播放內容" : t("schedClickToAdd")}
                  </p>
                  <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={form.joinDefaultSchedule}
                      onChange={(e) => setForm({ ...form, joinDefaultSchedule: e.target.checked })}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span>加入預設排程</span>
                  </label>
                </div>

                <Tabs defaultValue="media" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-8">
                    <TabsTrigger value="media" className="text-xs gap-1">
                      <FileImage className="w-3 h-3" />
                      {t("schedTabMedia")}
                    </TabsTrigger>
                    <TabsTrigger value="design" className="text-xs gap-1">
                      <Layers className="w-3 h-3" />
                      {t("schedTabDesign")}
                    </TabsTrigger>
                    <TabsTrigger value="widget" className="text-xs gap-1">
                      <Code2 className="w-3 h-3" />
                      {t("schedTabWidget")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="media" className="mt-2">
                    {mediaOptions.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        {t("mediaNoResult")}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                        {mediaOptions.map((media) => (
                          <button
                            key={media.id}
                            type="button"
                            onClick={() => addMediaToForm(media)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors"
                          >
                            {media.type === "image" ? (
                              <FileImage className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            ) : (
                              <FileVideo className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            )}
                            <span className="truncate text-xs text-foreground">{media.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="design" className="mt-2">
                    {designOptions.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        {t("studioNoProjects")}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                        {designOptions.map((dp) => (
                          <button
                            key={dp.id}
                            type="button"
                            onClick={() => addDesignToForm(dp)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors"
                          >
                            <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
                            <div className="truncate">
                              <span className="text-xs text-foreground block truncate">{dp.name}</span>
                              <span className="text-[10px] text-muted-foreground">{dp.aspect}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="widget" className="mt-2">
                    {widgetOptions.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        {t("mediaNoResult")}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                        {widgetOptions.map((w) => (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => addWidgetToForm(w)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-left transition-colors"
                          >
                            <Code2 className="w-3.5 h-3.5 text-accent-foreground shrink-0" />
                            <span className="truncate text-xs text-foreground">{w.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId
                ? dialogMode === "event"
                  ? "儲存事件"
                  : t("schedSaveChanges")
                : dialogMode === "event"
                  ? "新增事件"
                  : t("schedAdd")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("schedDeleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>{t("schedDeleteDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}