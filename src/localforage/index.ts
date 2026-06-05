import localforage from "localforage";

localforage.config({
  name: "HBMEdu",
  storeName: "cacheStore",
});

export default localforage;
