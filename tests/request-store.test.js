import assert from "node:assert/strict";
import test from "node:test";

import {
  RequestStorageError,
  RequestValidationError,
  STORAGE_KEY,
  appendRequest,
  createRequest,
  filterRequests,
  loadRequests,
  saveRequests,
} from "../src/request-store.js";

const validInput = {
  requester: "  Jordan Lee  ",
  department: "Operations",
  equipment: "  Laptop  ",
  neededBy: "2026-09-15",
  priority: "  Normal  ",
  reason: "  Replace a failed field computer.  ",
};

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, value);
  }
}

test("createRequest trims input and adds system fields", () => {
  const request = createRequest(validInput, {
    id: "request-1",
    now: new Date("2026-08-17T12:00:00.000Z"),
  });

  assert.deepEqual(request, {
    id: "request-1",
    requester: "Jordan Lee",
    department: "Operations",
    equipment: "Laptop",
    neededBy: "2026-09-15",
    priority: "Normal",
    reason: "Replace a failed field computer.",
    createdAt: "2026-08-17T12:00:00.000Z",
  });
});

test("createRequest reports missing required fields", () => {
  assert.throws(
    () => createRequest({ ...validInput, requester: "", equipment: " " }),
    (error) => {
      assert.ok(error instanceof RequestValidationError);
      assert.deepEqual(Object.keys(error.errors), ["requester", "equipment"]);
      return true;
    },
  );
});

test("createRequest requires a supported priority", () => {
  assert.throws(
    () => createRequest({ ...validInput, priority: "Urgent" }),
    (error) => {
      assert.ok(error instanceof RequestValidationError);
      assert.deepEqual(error.errors, { priority: "Select a priority." });
      return true;
    },
  );
});

test("appendRequest returns a new list with the newest request first", () => {
  const original = [{ id: "old" }];
  const result = appendRequest(original, { id: "new" });

  assert.deepEqual(result.map((request) => request.id), ["new", "old"]);
  assert.deepEqual(original.map((request) => request.id), ["old"]);
});

test("filterRequests returns all requests or exact priority matches", () => {
  const requests = [
    { id: "high", priority: "High" },
    { id: "normal", priority: "Normal" },
    { id: "low", priority: "Low" },
    { id: "missing" },
    { id: "unknown", priority: "Urgent" },
  ];

  assert.deepEqual(filterRequests(requests, "All"), requests);
  assert.deepEqual(filterRequests(requests, "High"), [requests[0]]);
  assert.deepEqual(filterRequests(requests, "Normal"), [requests[1]]);
  assert.deepEqual(filterRequests(requests, "Low"), [requests[2]]);
});

test("saveRequests and loadRequests round-trip valid records", () => {
  const storage = new MemoryStorage();
  const request = createRequest(validInput, {
    id: "request-2",
    now: new Date("2026-08-17T12:00:00.000Z"),
  });

  saveRequests([request], storage);

  assert.deepEqual(loadRequests(storage), [request]);
});

test("loadRequests preserves records with missing or unrecognized priorities", () => {
  const storage = new MemoryStorage();
  const legacyRequest = {
    id: "request-legacy",
    requester: "Jordan Lee",
    department: "Operations",
    equipment: "Laptop",
    neededBy: "2026-09-15",
    reason: "Replace a failed field computer.",
    createdAt: "2026-08-17T12:00:00.000Z",
  };
  const unrecognizedPriorityRequest = {
    ...legacyRequest,
    id: "request-unrecognized-priority",
    priority: "Urgent",
  };
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify([legacyRequest, unrecognizedPriorityRequest]),
  );

  assert.deepEqual(loadRequests(storage), [legacyRequest, unrecognizedPriorityRequest]);
});

test("saveRequests refuses to overwrite malformed stored JSON", () => {
  const storage = new MemoryStorage();
  const damagedData = "not-json";
  storage.setItem(STORAGE_KEY, damagedData);

  assert.deepEqual(loadRequests(storage), []);
  assert.throws(
    () => saveRequests([createRequest(validInput)], storage),
    RequestStorageError,
  );
  assert.equal(storage.getItem(STORAGE_KEY), damagedData);
});

test("saveRequests refuses to overwrite invalid records and preserves valid records", () => {
  const storage = new MemoryStorage();
  const validRequest = createRequest(validInput, { id: "request-valid" });
  const invalidRequest = { ...validRequest, requester: null };
  const storedRequests = [validRequest, invalidRequest];
  const storedData = JSON.stringify(storedRequests);
  storage.setItem(STORAGE_KEY, storedData);

  assert.deepEqual(loadRequests(storage), [validRequest]);
  assert.throws(
    () => saveRequests([...loadRequests(storage), createRequest(validInput)], storage),
    RequestStorageError,
  );
  assert.equal(storage.getItem(STORAGE_KEY), storedData);
});
