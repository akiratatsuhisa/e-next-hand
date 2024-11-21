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
    storageBucket: "gs://amakusa-d95a0.appspot.com",
  });
}

export const app = getApp();

export const bucket = getStorage().bucket();
