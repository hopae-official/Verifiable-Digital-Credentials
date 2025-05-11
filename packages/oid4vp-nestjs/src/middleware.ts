import { Oid4VpConfig } from './type';
import express, { Router, Request, Response } from 'express';
import { URL } from 'url';

export class Oid4VpMiddleware {
  private router: Router;

  constructor(config: Oid4VpConfig) {
    this.router = Router();
    this.setupRoutes(config);
  }

  private appendUrl(baseUrl: string, path: string): string {
    return new URL(path, baseUrl).href;
  }

  private setupRoutes(config: Oid4VpConfig) {
    this.router.use(express.json());
    this.router.use(express.urlencoded({ extended: true }));
  }

  public getRouter(): Router {
    return this.router;
  }
}
