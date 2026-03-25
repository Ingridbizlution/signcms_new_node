import * as authService from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const data = await authService.register(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.me(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const data = await authService.requestPasswordReset(req.body.email);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const data = await authService.resetPassword(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
