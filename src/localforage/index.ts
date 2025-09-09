// src/utils/cacheService.ts
import localforage from "localforage";

localforage.config({
  name: "HoaBanMaiEdu",
  storeName: "cacheStore",
});

export default localforage;
