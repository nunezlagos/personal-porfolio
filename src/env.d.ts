/// <reference path="../.astro/types.d.ts" />
/// <reference path="../node_modules/astro/client.d.ts" />

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        DB: import('@cloudflare/workers-types').D1Database;
      };
    };
  }
}
