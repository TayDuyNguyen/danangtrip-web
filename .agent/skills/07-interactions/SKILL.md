---
name: 07-interactions
description: Define and implement form flows, search, filters, pagination, mutations, and user feedback. Use when a page has meaningful user actions.
---

# Skill: 07-interactions

### Overview Notes

- Read `.agent/rules/REPO_FACTS.md` before using any example in this skill.
- For `danangtrip-web`, do not assume `react-hook-form` is the default current pattern.
- Follow the touched feature's existing form architecture unless the task is an explicit migration.
- Zod remains the validation baseline, but integration style may differ by feature.

## Overview

## When to Use

- When a page has form flows, CRUD actions, filters, search, pagination, or destructive actions.
- When interaction behavior needs to be specified before implementation.
- When UX feedback and state transitions are complex enough to document explicitly.

Skill này mô tả các interaction chính của feature: forms, CRUD, filter/search/sort, pagination, dialog, toast feedback.
Nó là bước biến page từ hiển thị dữ liệu thành feature có thể thao tác thật.

## Required Input

- `persona.md`
- `.agent/rules/PROJECT_RULES.md`
- `.agent/rules/REPO_FACTS.md`
- `.agent/memory/WORKING_STATE.md`
- `.agent/memory/HANDOFF.md`
- Analysis file
- Validators từ bước `03`
- Hooks và components từ bước `05` và `06`
- `src/hooks/useDebounce.ts`

## Recommended Questions To Answer

1. Action chính của user là gì?
2. Action nào destructive?
3. Form nào cần validate?
4. Search/filter có sync URL không?
5. Feedback nào user bắt buộc phải thấy?

## Process

### 1) Action Breakdown

Liệt kê:

- create
- update
- delete
- search
- filter
- sort
- pagination
- export/import nếu có

### 2) Form Flow Review

Mô tả:

- validator (Zod schema nào)
- submit flow
- reset/cancel flow
- error handling

### 3) URL-Synced State Review

Phải nói:

- state nào local
- state nào sync URL
- debounce ra sao

### 4) Destructive And Feedback Review

Nói rõ:

- confirm UI
- success toast
- error toast
- invalidate strategy

### 5) Handoff To Implementation

Interaction spec phải để người code biết:

- component nào chứa form
- hook nào chứa mutation
- locale files nào cần key mới

## Pattern Chuẩn Của Repo

### Zod + react-hook-form pattern — Next.js web

```tsx
// src/features/contact/components/ContactForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormValues } from '../schemas/contact.schema';
import { useSubmitContact } from '../hooks/useContactMutations';
import { useTranslations } from 'next-intl';

export function ContactForm() {
  const t = useTranslations('contact');
  const { mutate: submit, isPending } = useSubmitContact();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    submit(data, {
      onSuccess: () => {
        reset();
        // toast handled in mutation
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} aria-label={t('name')} />
      {errors.name && <p role="alert">{errors.name.message}</p>}

      <input {...register('email')} type="email" aria-label={t('email')} />
      {errors.email && <p role="alert">{errors.email.message}</p>}

      <textarea {...register('message')} aria-label={t('message')} />
      {errors.message && <p role="alert">{errors.message.message}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? t('sending') : t('send')}
      </button>
    </form>
  );
}
```

### URL-synced search + filter — Next.js App Router

```tsx
// src/features/tours/components/TourFilters.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

export function TourFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset page khi search
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearch]);

  return (
    <input
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      placeholder="Tìm kiếm tour..."
    />
  );
}
```

### Mutation với feedback

```ts
// src/features/contact/hooks/useContactMutations.ts
import { useMutation } from '@tanstack/react-query';
import { contactService } from '../services/contact.service';
import { toast } from 'sonner'; // hoặc toast library của repo

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (data: ContactFormValues) => contactService.submit(data),
    onSuccess: () => {
      toast.success('Gửi thành công! Chúng tôi sẽ liên hệ sớm.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

### Destructive action — confirm trước khi xóa

```tsx
// Không dùng window.confirm
// Dùng Dialog component từ design system

function DeleteBookingButton({ bookingId }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: cancel, isPending } = useCancelBooking();

  return (
    <>
      <button onClick={() => setOpen(true)}>Hủy đặt tour</button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Xác nhận hủy đặt tour?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
          <AlertDialogCancel>Không</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => cancel(bookingId, { onSuccess: () => setOpen(false) })}
            disabled={isPending}
          >
            {isPending ? 'Đang hủy...' : 'Xác nhận hủy'}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

## Output Document

Tạo file:

- `.agent/artifacts/interaction-specs/YYYY-MM-DD__<feature-slug>__interaction-spec.md`

Template:

- `template_interaction_spec.md`

## Strict Rules

- Validation phải dùng Zod + `zodResolver` — không dùng controlled state thủ công
- Mọi user-facing message phải qua `next-intl` (`useTranslations`)
- Search phải debounce (400ms)
- Destructive actions phải có confirm step — không dùng `window.confirm`
- Không hiện raw backend error — normalize trước khi toast

## Rationalizations

| Lý do hay gặp | Thực tế |
|---|---|
| "Form đơn giản, dùng useState cho nhanh" | Khi cần validation, reset, hoặc dirty check, sẽ phải refactor toàn bộ |
| "window.confirm đủ rồi" | Không nhất quán với design system, không customizable |
| "Search không cần debounce, API nhanh" | Mỗi keystroke = 1 request — tốn bandwidth và gây race condition |
| "Toast message hardcode tiếng Việt cho nhanh" | Khi switch sang English, toast vẫn hiện tiếng Việt |


## Red Flags

Nếu thấy những dấu hiệu sau, phải dừng và flag:

- Form dùng `useState` cho từng field → không có validation tích hợp
- `window.confirm()` cho delete → không nhất quán với design system
- Search không debounce → API call mỗi keystroke
- URL params không update khi filter thay đổi → user mất state khi back/refresh
- Hardcoded string trong toast thay vì `t()` → không i18n được

## Documentation Expectations

Interaction spec tốt phải có:

- main actions (list đầy đủ)
- forms (schema, submit flow, reset flow)
- search/filter/pagination (URL sync, debounce)
- destructive actions (confirm UI, feedback)
- i18n impact (keys cần thêm vào `vi/en`)

## Verification

- Đối chiếu `checklist.md`
- Interaction spec phải liệt kê trigger, validation, feedback, URL sync, và mutation dependencies
- Mọi destructive action phải có confirm step
- Mọi user-facing text phải qua i18n
