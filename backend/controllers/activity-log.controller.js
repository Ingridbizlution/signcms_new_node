import * as activityLogService from "../services/activity-log.service.js";

export async function create(req, res, next) {
  try {
    const data = await activityLogService.createActivityLog({
      userId: req.user?.id || null,
      action: req.body.action,
      category: req.body.category,
      targetType: req.body.targetType || null,
      targetId: req.body.targetId || null,
      targetName: req.body.targetName || null,
      detail: req.body.detail || null,
      orgId: req.body.orgId || null,
      ipAddress: req.body.ipAddress || req.ip || null,
    });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}
