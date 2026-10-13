# Enterprise Angular Assignment: Enterprise Task Management Platform

## Overview

Build an **Enterprise Task Management Dashboard** using modern Angular (v17+ with Standalone Components and Signals). This assignment covers core Angular architectural concepts through practical implementation using a public REST API.

---

## API Specifications

- **Base Endpoint:** `https://jsonplaceholder.typicode.com`
- **Endpoints:**
  - `GET /todos` — Retrieve list of task items
  - `GET /todos/:id` — Retrieve task details by ID
  - `POST /todos` — Create a new task item
  - `PUT /todos/:id` — Update complete task item
  - `PATCH /todos/:id` — Update status or partial fields
  - `DELETE /todos/:id` — Remove task item
  - `GET /users` — Retrieve user directory for assignment details

---

## Architecture Requirements

### 1. Components & Architecture

- **Standalone Architecture:** Implement components without `NgModule` declarations using `standalone: true`.
- **Component Hierarchy:**
  - **Root (`AppComponent`):** Houses top-level navigation, dynamic notification host, and primary `router-outlet`.
  - **Smart Component (`TaskListComponent`):** Manages component state, search/filter inputs, and API orchestration.
  - **Dumb Component (`TaskCardComponent`):** Presentational component utilizing Inputs (`input()` or `@Input()`) and Outputs (`output()` or `@Output()`).
  - **Deferred Content Loading:** Apply `@defer` block directives to lazy-load non-critical components (e.g., `TaskAnalyticsChartComponent`).

### 2. Angular Signals & State Management

- **Signal State:** Use `signal()` to track the active task list, selected filter status (All, Completed, Pending), search queries, and selected user IDs.
- **Derived State:** Define `computed()` state to dynamically calculate total task count, completed task count, and active filtered results.
- **Side Effects:** Write an `effect()` to observe filter updates and synchronize user preferences to `localStorage`.

### 3. Control Flow & Structural Styling

- **Control Flow Syntax:** Write template conditionals and iterations using `@if`, `@else`, `@for` (with mandatory `track` expression), and `@switch` / `@case` for task status mapping.
- **Dynamic Classes & Styles:** Implement class binding using `[ngClass]` and dynamic inline styling via `[ngStyle]`.

### 4. Dependency Injection & Service Layer

- **Core Service (`TaskService`):** Inject `HttpClient` using the `inject()` function.
- **API Handlers:** Implement methods covering CRUD operations (`getTasks`, `getTaskById`, `createTask`, `updateTask`, `deleteTask`).
- **Injection Tokens:** Define a custom `InjectionToken` (`API_CONFIG`) to inject base configuration values into services.

### 5. Reactive Extensions (RxJS)

- **Debounced Search:** Implement continuous search query handling using a `Subject` or `BehaviorSubject` piped through `debounceTime(300)`, `distinctUntilChanged()`, and `switchMap()`.
- **Concurrent Requests:** Fetch both `/todos` and `/users` concurrently using `forkJoin` to map user metadata onto each task record.
- **Resilience:** Intercept failed network requests using `catchError()` operators to ensure graceful fallback UI states.

### 6. Routing & Navigation

- **Lazy Loading Routes:** Configure routes using `provideRouter()` and load components asynchronously with `loadComponent()`.
- **Dynamic Parameters:** Build detail routes (e.g., `/tasks/:id`) to display specific task details.
- **Guards & Resolvers:**
  - Implement a functional route guard (`CanActivateFn`) to control access to task creation routes.
  - Implement a functional resolver (`ResolveFn`) to pre-fetch task data prior to route activation.

### 7. Forms Processing

- **Reactive Forms:** Build a dynamic creation/edit form using `FormBuilder` with fields for `title`, `userId`, and `completed`.
- **Custom Validators:** Write a custom validation function verifying that task titles do not contain restricted buzzwords.
- **Template-Driven Integration:** Implement inline search inputs utilizing `[(ngModel)]` two-way data binding.

### 8. Custom Directives & Pipes

- **Custom Attribute Directive:** Create a `HighlightPriorityDirective` (`[appHighlightPriority]`) that dynamically alters element borders based on task status or priority.
- **Custom Pipe:** Implement a `TaskStatusPipe` (`transform(value: boolean): string`) to format raw boolean completion flags into structured strings ("COMPLETED" / "IN PROGRESS").

### 9. HTTP Interceptors

- **Functional Interceptor:** Implement an `HttpInterceptorFn` that appends an `Authorization: Bearer <token>` header to all outgoing requests and logs request duration to the console.

### 10. Dynamic UI & Content Projection

- **Dynamic Component Loading:** Programmatically render a Toast Notification component using `ViewContainerRef` upon completing CRUD operations.
- **Content Projection:** Design a reusable Modal component supporting multi-slot projection via `<ng-content select="[modal-header]">` and `<ng-content select="[modal-body]">`.

---

## Submission Checklist

- [ ] Standalone project structure initialized via Angular CLI
- [ ] Central `TaskService` handling all HTTP CRUD interactions
- [ ] Filterable UI driven by Signals (`signal()`, `computed()`) and `@for` control flow
- [ ] Reactive form implementation with custom validations
- [ ] Lazy-loaded route module featuring functional guards and resolvers
- [ ] Functional HTTP interceptor handling headers and telemetry logs
