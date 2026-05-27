# Interaction Specification: user-profile

> Feature slug: `web_route_api_next_screen_review`
> Date: 2026-05-27
> Target screen: **user-profile**

---

## 1) Interaction Flow & Form Handlers

The form controls will utilize React state and Zod schema parsing to trigger validation, handle form resetting, and control submitting indicator states.

---

## 2) Component State Diagram

```
                 ┌───────────────┐
                 │  State: Idle  │
                 └───────┬───────┘
                         │
             Input edit  │  Click cancel / reset
             ┌───────────┴───────────┐
             ▼                       ▼
      ┌──────────────┐       ┌───────────────┐
      │State: Dirty  ├──────>│ State: Reset  │
      └──────┬───────┘       └───────────────┘
             │
             │  Click Save (Passes Zod validation)
             ▼
     ┌───────────────┐
     │State: Saving  │
     └───────┬───────┘
             │
      ┌──────┴───────┐
      ▼              ▼
  [Success]       [Failure]
  Toast alert     Toast alert & show field error
```

---

## 3) Detailed Interactive Behavior

### 3.1 Field-level Validation
- **Behavior:** Schema validation via `updateProfileSchema.safeParse` executes on form submission.
- **Error display:** Helper text shifts to red, showing the exact Zod message below the incorrect input field.

### 3.2 Action Button States
- **Submit button:** If loading is active, the button renders as disabled, shows the Loading spinner, and text changes to "Đang lưu..." / "Saving...".
- **Cancel button:** Clicking resets the input fields back to the pristine database values fetched by `useProfileQuery`. Shows red hover border effect as defined in the layout specifications.

### 3.3 Avatar Upload Interactions
- **File picking:** Click on the camera overlay on the avatar circle. The browser opens the native file dialog.
- **Constraints check:**
  - File size must be strictly smaller than 2MB.
  - File format must match `image/*`.
- **Upload progress:** When uploading, a dark blur mask displays over the avatar image with a circular spinner. Hover states are deactivated during uploading.
- **Error feedback:** If file check fails or the upload returns an error, the spinner disappears, the original image is restored, and a Sonner toast pops up.
