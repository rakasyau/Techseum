import type { TopicTranslation } from "./types";
import { cacheId } from "./topics/cache";
import { cpuId } from "./topics/cpu";
import { ramId } from "./topics/ram";
import { ssdId } from "./topics/ssd";
import { gpuId } from "./topics/gpu";
import { wifiId } from "./topics/wifi";
import { bluetoothId } from "./topics/bluetooth";
import { batteryId } from "./topics/battery";
import { touchscreenId } from "./topics/touchscreen";
import { cameraId } from "./topics/camera";
import { smartphoneId } from "./topics/smartphone";
import { neuralNetId } from "./topics/neural-net";
import { cloudId } from "./topics/cloud";

/*
 * Indonesian overlays for exhibit content.
 *
 * Only prose lives here: titles, summaries, level ledes and blocks, simulation
 * labels and 3D hotspot text. Ids, coordinates and answer keys stay in the
 * English source data. Anything missing here falls back to English.
 *
 * One file per exhibit under ./topics keeps a translation reviewable on its
 * own rather than in a single enormous table.
 */
export const idTopics: Record<string, TopicTranslation | undefined> = {
  cache: cacheId,
  cpu: cpuId,
  ram: ramId,
  ssd: ssdId,
  gpu: gpuId,
  wifi: wifiId,
  bluetooth: bluetoothId,
  battery: batteryId,
  touchscreen: touchscreenId,
  camera: cameraId,
  smartphone: smartphoneId,
  "neural-net": neuralNetId,
  cloud: cloudId,
};
