import "server-only";

import {
  initializeApp,
  applicationDefault,
  getApp,
  getApps,
} from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    storageBucket: process.env.GOOGLE_BUCKET,
  });
}

export const app = getApp();

export const bucket = getStorage().bucket();
