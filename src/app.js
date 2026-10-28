import {
  RequestValidationError,
  RequestStorageError,
  appendRequest,
  createRequest,
  filterRequests,
  loadRequests,
  saveRequests,
} from "./request-store.js";

const form = document.querySelector("#request-form");
const message = document.querySelector("#form-message");
const neededByInput = document.querySelector("#needed-by");
const count = document.querySelector("#request-count");
const emptyState = document.querySelector("#empty-state");
const filteredEmptyState = document.querySelector("#filtered-empty-state");
const tableWrapper = document.querySelector("#request-table-wrapper");
const tableBody = document.querySelector("#request-table-body");
const priorityFilter = document.querySelector("#request-priority-filter");

let requests = loadRequests();
let selectedPriority = "All";

neededByInput.min = new Date().toISOString().slice(0, 10);
renderRequests();

priorityFilter.addEventListener("change", () => {
  selectedPriority = priorityFilter.value;
  renderRequests();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFieldErrors();
  setMessage("");

  const input = Object.fromEntries(new FormData(form).entries());

  try {
    const request = createRequest(input);
    const updatedRequests = appendRequest(requests, request);
    saveRequests(updatedRequests);
    requests = updatedRequests;
    form.reset();
    neededByInput.min = new Date().toISOString().slice(0, 10);
    setMessage("Request added.");
    renderRequests();
    document.querySelector("#requester").focus();
  } catch (error) {
    if (error instanceof RequestValidationError) {
      showFieldErrors(error.errors);
      setMessage("Complete all required fields.", true);
      return;
    }

    if (error instanceof RequestStorageError) {
      setMessage("Saved requests could not be read safely. Existing data was not changed.", true);
      console.error(error);
      return;
    }

    setMessage("The request could not be saved. Try again.", true);
    console.error(error);
  }
});

function renderRequests() {
  const hasRequests = requests.length > 0;
  const visibleRequests = filterRequests(requests, selectedPriority);
  const hasVisibleRequests = visibleRequests.length > 0;

  count.textContent = `${requests.length} ${requests.length === 1 ? "request" : "requests"}`;
  emptyState.hidden = hasRequests;
  filteredEmptyState.hidden = !hasRequests || hasVisibleRequests;
  tableWrapper.hidden = !hasVisibleRequests;
  tableBody.replaceChildren(...visibleRequests.map(createRequestRow));
}

function createRequestRow(request) {
  const row = document.createElement("tr");
  const values = [
    request.requester,
    request.department,
    request.equipment,
    request.priority ?? "Not set",
    formatDate(request.neededBy),
    request.reason,
    formatDateTime(request.createdAt),
  ];

  for (const value of values) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.append(cell);
  }

  return row;
}

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function formatDateTime(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function showFieldErrors(errors) {
  const firstInvalidField = Object.keys(errors)[0];

  for (const fieldName of Object.keys(errors)) {
    form.elements[fieldName]?.setAttribute("aria-invalid", "true");
  }

  form.elements[firstInvalidField]?.focus();
}

function clearFieldErrors() {
  for (const element of form.elements) {
    element.removeAttribute?.("aria-invalid");
  }
}

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}
