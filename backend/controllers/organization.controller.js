import * as organizationService from "../services/organization.service.js";

export async function list(req, res, next) {
  try {
    const data = await organizationService.listOrganizations();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = await organizationService.createOrganization(req.body, req.user.id);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const data = await organizationService.updateOrganization(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await organizationService.deleteOrganization(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
