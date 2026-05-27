# UI Specification: user-profile

> Feature slug: `web_route_api_next_screen_review`
> Date: 2026-05-27
> Target screen: **user-profile**

---

## 1) Layout & Component Specs

The visual interface will match the premium, dark-mode, glassmorphic layout specified in `DESIGN.md` and `PROJECT_RULES.md`.

### 1.1 Component Breakdown

| Component | Layer | Path | Purpose |
|---|---|---|---|
| `AvatarUploader` | Molecule | `src/features/profile/components/AvatarUploader.tsx` | Profile image representation with overlay edit controls and file upload click triggers. |
| `ProfileEditForm` | Organism | `src/features/profile/components/ProfileEditForm.tsx` | Main edit fields (Full Name, Phone, Birthday, Gender, City) with validation and actions. |
| `ProfileEditFormContainer` | Organism | `src/features/profile/components/ProfileEditFormContainer.tsx` | Queries active profile, handles API actions and manages toast feedback messages. |

---

## 2) Component Details & Props

### 2.1 `AvatarUploader`
- **Visual Presentation:** A circular image (`w-24 h-24 sm:w-28 sm:h-28`) with custom border and shadow. Hovering reveals a semi-transparent dark mask with a Camera icon and "Đổi ảnh" / "Change photo" label.
- **Props interface:**
  ```typescript
  interface AvatarUploaderProps {
    avatarUrl?: string;
    name?: string;
    onUpload: (file: File) => void;
    isUploading?: boolean;
  }
  ```

### 2.2 `ProfileEditForm`
- **Fields:**
  - **Full Name:** Text input.
  - **Phone:** Text input with phone regex check.
  - **Birthdate:** Date selection input.
  - **Gender:** Custom select dropdown (Nam / Nữ / Khác / Không muốn tiết lộ).
  - **City:** Text input.
  - **Email (Read-only):** Greyed input displaying static account mail.
- **Props interface:**
  ```typescript
  interface ProfileEditFormProps {
    initialValues: UpdateProfileFormInput & { email: string };
    onSubmit: (values: UpdateProfileFormInput) => void;
    isLoading?: boolean;
  }
  ```

---

## 3) Responsive Behavior

- **Desktop (>= 1024px):** Layout divides in 2 columns: left sidebar is 240px; right container takes `flex-1`. Inside the edit card, inputs are displayed in a two-column grid (`grid-cols-2`).
- **Tablet / Mobile (< 1024px):** Layout runs in a single vertical flex container. Sidebar is replaced by the swipeable horizontal navigations. Inside the edit card, all fields stack vertically in single column.

---

## 4) UI States

| Section/Component | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|---|---|---|---|---|---|---|
| **AvatarUploader** | Spinner overlay | Initial letters display | Toast alert | Updated photo | Drag/drop inactive | Show edit overlay |
| **ProfileEditForm** | Skeleton fields | N/A | Inline red helper text | Toast success | Inputs locked | Active border highlight |
| **Form Actions** | Buttons disabled | N/A | Toast error | Toast success | Buttons disabled | Accent bg color |
