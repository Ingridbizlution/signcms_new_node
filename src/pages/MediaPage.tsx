import { useState, useEffect, useRef, useMemo } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Image, Upload, Trash2, Search, Grid3X3, List, Eye, FileImage, FileVideo, Clock, HardDrive, Loader2,
  Code2, Calendar, Globe, Type, Plus, CloudSun, QrCode, Timer, Youtube, FolderOpen, Pencil, FolderPlus, Settings2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
...
                      {isAdmin ? (
                        <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                          <Select
                            value={item.design_project_id || "__none__"}
                            onValueChange={(value) => handleChangeProject(item.id, value === "__none__" ? null : value)}
                          >
                            <SelectTrigger className="h-6 w-auto min-w-0 gap-1 border-0 bg-transparent px-0 py-0 text-[11px] text-muted-foreground shadow-none hover:text-foreground focus:ring-0 focus:ring-offset-0">
                              <FolderOpen className="w-3 h-3 shrink-0" />
                              <SelectValue placeholder={t("mediaNoProject")} />
                            </SelectTrigger>
                            <SelectContent align="start">
                              <SelectItem value="__none__">{t("mediaNoProject")}</SelectItem>
                              {projects.map((p) => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <span className="flex items-center gap-0.5"><FolderOpen className="w-3 h-3" />{(() => { const p = projects.find(pr => pr.id === item.design_project_id); return p ? p.name : t("mediaNoProject"); })()}</span>
                      )}
...
                      {isAdmin ? (
                        <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                          <Select
                            value={item.design_project_id || "__none__"}
                            onValueChange={(value) => handleChangeProject(item.id, value === "__none__" ? null : value)}
                          >
                            <SelectTrigger className="h-6 w-auto min-w-0 gap-1 border-0 bg-transparent px-0 py-0 text-xs text-muted-foreground shadow-none hover:text-foreground focus:ring-0 focus:ring-offset-0">
                              <FolderOpen className="w-3 h-3 shrink-0" />
                              <SelectValue placeholder={t("mediaNoProject")} />
                            </SelectTrigger>
                            <SelectContent align="start">
                              <SelectItem value="__none__">{t("mediaNoProject")}</SelectItem>
                              {projects.map((p) => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1"><FolderOpen className="w-3 h-3" />{(() => { const p = projects.find(pr => pr.id === item.design_project_id); return p ? p.name : t("mediaNoProject"); })()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}><Eye className="w-4 h-4" /></Button>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}><Trash2 className="w-4 h-4" /></Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 truncate pr-6">
              {previewItem?.type === "widget" ? <Code2 className="w-5 h-5 text-primary shrink-0" /> : previewItem?.type === "image" ? <FileImage className="w-5 h-5 text-primary shrink-0" /> : <FileVideo className="w-5 h-5 text-primary shrink-0" />}
              <span className="truncate">{previewItem?.name}</span>
            </DialogTitle>
            <DialogDescription className="sr-only">素材預覽對話框，可檢視圖片、影片或 Widget 預覽內容。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {previewItem?.type === "widget" ? (
                (() => { const c = parseWidgetConfig(previewItem.url); return c ? <AnimatedWidgetWrapper config={c}><WidgetLivePreview config={c} /></AnimatedWidgetWrapper> : <Code2 className="w-16 h-16 opacity-30" />; })()
              ) : previewItem?.url && previewItem.type === "image" ? (
                <img src={previewItem.url} alt={previewItem.name} className="w-full h-full object-contain" />
              ) : previewItem?.url && previewItem.type === "video" ? (
                <video src={previewItem.url} controls className="w-full h-full" />
              ) : (
                <div className="text-center text-muted-foreground">
                  {previewItem?.type === "image" ? <FileImage className="w-16 h-16 mx-auto mb-2 opacity-30" /> : <FileVideo className="w-16 h-16 mx-auto mb-2 opacity-30" />}
                  <p className="text-sm">{t("mediaPreviewUnavailable")}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-muted-foreground text-xs">{t("mediaType")}</p>
                <p className="font-medium text-foreground">{previewItem ? getTypeBadge(previewItem) : ""}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-muted-foreground text-xs">{t("mediaFileSize")}</p>
                <p className="font-medium text-foreground">{previewItem?.size}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-muted-foreground text-xs">{previewItem?.type === "widget" ? t("widgetType") : t("mediaResolution")}</p>
                <p className="font-medium text-foreground">{previewItem?.type === "widget" ? t("widget") : previewItem?.dimensions}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-muted-foreground text-xs">{previewItem?.type === "video" ? t("mediaDuration") : t("mediaUploadDate")}</p>
                <p className="font-medium text-foreground">{previewItem?.type === "video" ? previewItem?.duration : previewItem?.created_at?.split("T")[0]}</p>
              </div>
            </div>
            {isAdmin && (
              <div className="flex justify-end">
                <Button variant="destructive" size="sm" className="gap-2" onClick={() => { if (previewItem) { setDeleteId(previewItem.id); setPreviewItem(null); } }}>
                  <Trash2 className="w-4 h-4" />
                  {t("mediaDeleteItem")}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Widget Creation Dialog */}
      <Dialog open={widgetDialogOpen} onOpenChange={setWidgetDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Code2 className="w-5 h-5 text-primary" />{t("mediaAddWidget")}</DialogTitle>
            <DialogDescription className="sr-only">建立與調整 Widget 設定，並在對話框底部即時預覽結果。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 overflow-y-auto flex-1 pr-1 min-h-0">
            <div className="space-y-2">
              <Label>{t("widgetName")} *</Label>
              <Input value={widgetForm.name} onChange={(e) => setWidgetForm({ ...widgetForm, name: e.target.value })} placeholder={t("widgetNamePlaceholder")} />
            </div>
            <div className="space-y-2">
              <Label>{t("mediaProjectGroup")}</Label>
              <Select value={(widgetForm as any).projectId || "__none__"} onValueChange={(v) => setWidgetForm({ ...widgetForm, projectId: v } as any)}>
                <SelectTrigger><FolderOpen className="w-4 h-4 mr-1.5 text-muted-foreground" /><SelectValue placeholder={t("mediaNoProject")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t("mediaNoProject")}</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("widgetType")}</Label>
              <div className="grid grid-cols-4 gap-2">
                {(["clock", "date", "webpage", "marquee", "qrcode", "countdown", "youtube", "weather"] as WidgetSubType[]).map((wt) => {
                  const Icon = WIDGET_ICONS[wt];
                  const labels: Record<WidgetSubType, string> = { date: t("widgetDate"), clock: t("widgetClock"), webpage: t("widgetWebpage"), marquee: t("widgetMarquee"), qrcode: t("widgetQrcode"), countdown: t("widgetCountdown"), youtube: t("widgetYoutube"), weather: t("widgetWeather") };
                  const descs: Record<WidgetSubType, string> = { date: t("widgetDateDesc"), clock: t("widgetClockDesc"), webpage: t("widgetWebpageDesc"), marquee: t("widgetMarqueeDesc"), qrcode: t("widgetQrcodeDesc"), countdown: t("widgetCountdownDesc"), youtube: t("widgetYoutubeDesc"), weather: t("widgetWeatherDesc") };
                  return (
                    <button key={wt} type="button" onClick={() => setWidgetForm({ ...widgetForm, widgetType: wt })}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center ${
                        widgetForm.widgetType === wt ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      }`}>
                      <Icon className={`w-6 h-6 ${widgetForm.widgetType === wt ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs font-medium">{labels[wt]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {widgetForm.widgetType === "clock" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>{t("widgetClockStyle")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setWidgetForm({ ...widgetForm, clockStyle: "digital" })}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 transition-all text-sm ${widgetForm.clockStyle === "digital" ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:border-primary/40"}`}>
                      {t("widgetDigital")}
                    </button>
                    <button type="button" onClick={() => setWidgetForm({ ...widgetForm, clockStyle: "analog" })}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 transition-all text-sm ${widgetForm.clockStyle === "analog" ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:border-primary/40"}`}>
                      {t("widgetAnalog")}
                    </button>
                  </div>
                </div>
                {widgetForm.clockStyle === "digital" && (
                  <div className="space-y-2">
                    <Label>{t("widgetFormat")}</Label>
                    <Select value={widgetForm.format} onValueChange={(v) => setWidgetForm({ ...widgetForm, format: v as "12" | "24" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">{t("widgetFormat24")}</SelectItem>
                        <SelectItem value="12">{t("widgetFormat12")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label>{t("widgetShowDate")}</Label>
                  <Switch checked={widgetForm.showDate} onCheckedChange={(v) => setWidgetForm({ ...widgetForm, showDate: v })} />
                </div>
                <div className="space-y-2">
                  <Label>{t("widgetTimezone")}</Label>
                  <Select value={widgetForm.timezone} onValueChange={(v) => setWidgetForm({ ...widgetForm, timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {TIMEZONE_OPTIONS.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {widgetForm.widgetType === "webpage" && (
              <div className="space-y-2">
                <Label>{t("widgetUrl")}</Label>
                <Input value={widgetForm.url} onChange={(e) => setWidgetForm({ ...widgetForm, url: e.target.value })} placeholder={t("widgetUrlPlaceholder")} />
              </div>
            )}

            {widgetForm.widgetType === "marquee" && (
              <>
                <div className="space-y-2">
                  <Label>{t("widgetText")}</Label>
                  <Input value={widgetForm.text} onChange={(e) => setWidgetForm({ ...widgetForm, text: e.target.value })} placeholder={t("widgetTextPlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("widgetSpeed")}</Label>
                  <Select value={widgetForm.speed} onValueChange={(v) => setWidgetForm({ ...widgetForm, speed: v as "slow" | "normal" | "fast" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">{t("widgetSpeedSlow")}</SelectItem>
                      <SelectItem value="normal">{t("widgetSpeedNormal")}</SelectItem>
                      <SelectItem value="fast">{t("widgetSpeedFast")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {widgetForm.widgetType === "qrcode" && (
              <div className="space-y-2">
                <Label>{t("widgetQrcodeContent")}</Label>
                <Input value={widgetForm.qrcodeContent || ""} onChange={(e) => setWidgetForm({ ...widgetForm, qrcodeContent: e.target.value })} placeholder={t("widgetQrcodePlaceholder")} />
              </div>
            )}

            {widgetForm.widgetType === "countdown" && (
              <>
                <div className="space-y-2">
                  <Label>{t("widgetCountdownTitle")}</Label>
                  <Input value={widgetForm.countdownTitle || ""} onChange={(e) => setWidgetForm({ ...widgetForm, countdownTitle: e.target.value })} placeholder={t("widgetCountdownTitlePlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("widgetTargetDate")}</Label>
                  <Input type="datetime-local" value={widgetForm.targetDate || ""} onChange={(e) => setWidgetForm({ ...widgetForm, targetDate: e.target.value })} />
                </div>
              </>
            )}

            {widgetForm.widgetType === "youtube" && (
              <div className="space-y-2">
                <Label>{t("widgetYoutubeUrl")}</Label>
                <Input value={widgetForm.youtubeUrl || ""} onChange={(e) => setWidgetForm({ ...widgetForm, youtubeUrl: e.target.value })} placeholder={t("widgetYoutubeUrlPlaceholder")} />
              </div>
            )}

            {widgetForm.widgetType === "weather" && (
              <div className="space-y-2">
                <Label>{t("widgetCity")}</Label>
                <Input value={widgetForm.city || ""} onChange={(e) => setWidgetForm({ ...widgetForm, city: e.target.value })} placeholder={t("widgetCityPlaceholder")} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t("widgetBgColor")}</Label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setWidgetForm({ ...widgetForm, bgColor: "transparent" })}
                    className={`w-8 h-8 rounded border cursor-pointer relative overflow-hidden shrink-0 ${widgetForm.bgColor === "transparent" ? "ring-2 ring-primary border-primary" : "border-border"}`}
                    style={{ background: "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)", backgroundSize: "8px 8px", backgroundPosition: "0 0, 4px 4px" }}
                    title="Transparent" />
                  <input type="color" value={widgetForm.bgColor === "transparent" ? "#1a1a2e" : widgetForm.bgColor} onChange={(e) => setWidgetForm({ ...widgetForm, bgColor: e.target.value })} className="w-8 h-8 rounded border border-border cursor-pointer" />
                  <Input value={widgetForm.bgColor} onChange={(e) => setWidgetForm({ ...widgetForm, bgColor: e.target.value })} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("widgetTextColor")}</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={widgetForm.textColor} onChange={(e) => setWidgetForm({ ...widgetForm, textColor: e.target.value })} className="w-8 h-8 rounded border border-border cursor-pointer" />
                  <Input value={widgetForm.textColor} onChange={(e) => setWidgetForm({ ...widgetForm, textColor: e.target.value })} className="flex-1" />
                </div>
              </div>
            </div>

            {/* Font Size - shown for clock, date, marquee, countdown, weather */}
            {["clock", "date", "marquee", "countdown", "weather"].includes(widgetForm.widgetType) && (
              <div className="space-y-2">
                <Label>{t("widgetFontSize")}</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(["small", "medium", "large", "xlarge"] as const).map((size) => {
                    const sizeLabels = { small: t("widgetFontSizeSmall"), medium: t("widgetFontSizeMedium"), large: t("widgetFontSizeLarge"), xlarge: t("widgetFontSizeXLarge") };
                    return (
                      <button key={size} type="button" onClick={() => setWidgetForm({ ...widgetForm, fontSize: size })}
                        className={`p-2 rounded-lg border-2 transition-all text-sm text-center ${widgetForm.fontSize === size ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:border-primary/40"}`}>
                        {sizeLabels[size]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QR Code Size */}
            {widgetForm.widgetType === "qrcode" && (
              <div className="space-y-2">
                <Label>{t("widgetQrcodeSize")}：{widgetForm.qrcodeSize}px</Label>
                <input type="range" min={60} max={300} step={10} value={widgetForm.qrcodeSize}
                  onChange={(e) => setWidgetForm({ ...widgetForm, qrcodeSize: Number(e.target.value) })}
                  className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>60px</span><span>300px</span>
                </div>
              </div>
            )}

            {/* Animation */}
            <div className="space-y-2">
              <Label>{t("widgetAnimation")}</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["none", "fadeIn", "slideUp", "bounce", "zoomIn", "flipIn"] as WidgetAnimation[]).map((anim) => {
                  const animLabels: Record<WidgetAnimation, string> = { none: t("widgetAnimNone"), fadeIn: t("widgetAnimFadeIn"), slideUp: t("widgetAnimSlideUp"), bounce: t("widgetAnimBounce"), zoomIn: t("widgetAnimZoomIn"), flipIn: t("widgetAnimFlipIn") };
                  return (
                    <button key={anim} type="button" onClick={() => setWidgetForm({ ...widgetForm, animation: anim })}
                      className={`p-2 rounded-lg border-2 transition-all text-sm text-center ${widgetForm.animation === anim ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:border-primary/40"}`}>
                      {animLabels[anim]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-2">
              <Label>{t("widgetLivePreview")}</Label>
              <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted/30 shrink-0">
                <div className="w-full h-full overflow-hidden">
                  <AnimatedWidgetWrapper config={{
                    animation: widgetForm.animation,
                    widgetType: widgetForm.widgetType,
                  }}>
                    <WidgetLivePreview config={{
                      widgetType: widgetForm.widgetType,
                      url: widgetForm.url,
                      text: widgetForm.text,
                      speed: widgetForm.speed,
                      format: widgetForm.format,
                      clockStyle: widgetForm.clockStyle,
                      showDate: widgetForm.showDate,
                      timezone: widgetForm.timezone,
                      bgColor: widgetForm.bgColor,
                      textColor: widgetForm.textColor,
                      qrcodeContent: widgetForm.qrcodeContent,
                      targetDate: widgetForm.targetDate,
                      countdownTitle: widgetForm.countdownTitle,
                      youtubeUrl: widgetForm.youtubeUrl,
                      city: widgetForm.city,
                      fontSize: widgetForm.fontSize,
                      qrcodeSize: widgetForm.qrcodeSize,
                      animation: widgetForm.animation,
                    }} />
                  </AnimatedWidgetWrapper>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">{t("cancel")}</Button></DialogClose>
            <Button onClick={handleCreateWidget} className="gap-2"><Plus className="w-4 h-4" />{t("mediaAddWidget")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("mediaDeleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>{t("mediaDeleteDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t("confirmDelete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Project Management Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FolderOpen className="w-5 h-5 text-primary" />{t("mediaManageProjects")}</DialogTitle>
            <DialogDescription className="sr-only">{t("mediaManageProjects")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Add new project */}
            <div className="flex gap-2">
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder={t("mediaProjectNamePlaceholder")}
                onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
              />
              <Button onClick={handleCreateProject} disabled={!newProjectName.trim()} size="icon" className="shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Project list */}
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {projects.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">{t("mediaNoProject")}</p>
              )}
              {projects.map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 group">
                  {editingProject?.id === p.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editProjectName}
                        onChange={(e) => setEditProjectName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleUpdateProject(); if (e.key === "Escape") setEditingProject(null); }}
                        autoFocus
                        className="h-8"
                      />
                      <Button size="sm" onClick={handleUpdateProject} disabled={!editProjectName.trim()} className="h-8">{t("save")}</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingProject(null)} className="h-8">{t("cancel")}</Button>
                    </div>
                  ) : (
                    <>
                      <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-sm text-foreground truncate">{p.name}</span>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {media.filter((m) => m.design_project_id === p.id).length}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setEditingProject(p); setEditProjectName(p.name); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive" onClick={() => setDeleteProjectId(p.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Project Confirm */}
      <AlertDialog open={deleteProjectId !== null} onOpenChange={(open) => !open && setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("mediaDeleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>{t("mediaProjectDeleteConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t("confirmDelete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
