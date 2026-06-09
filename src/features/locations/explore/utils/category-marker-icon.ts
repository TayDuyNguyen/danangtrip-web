import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { resolveCategoryIcon } from "@/utils/category-icon";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function createCategoryMarkerIcon(
  iconKey: string | null,
  background: string,
  options?: { selected?: boolean; hovered?: boolean }
) {
  const selected = options?.selected ?? false;
  const hovered = options?.hovered ?? false;
  const MARKER_BOX = 44;
  const dotSize = selected ? 38 : hovered ? 36 : 34;
  const ring = selected
    ? "0 0 0 3px rgba(255,56,92,0.35)"
    : hovered
      ? "0 0 0 2px rgba(100,116,139,0.35)"
      : "0 2px 8px rgba(15,23,42,0.22)";

  const Icon = resolveCategoryIcon(iconKey);
  const iconMarkup = renderToStaticMarkup(
    createElement(Icon, { size: 15, color: "#1e293b" })
  );

  return L.divIcon({
    className: "explore-category-marker",
    html: `
      <div style="
        width:${MARKER_BOX}px;
        height:${MARKER_BOX}px;
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <div style="
          width:${dotSize}px;
          height:${dotSize}px;
          border-radius:9999px;
          background:${background};
          border:2px solid #ffffff;
          box-shadow:${ring};
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          ${iconMarkup}
        </div>
      </div>
    `,
    iconSize: [MARKER_BOX, MARKER_BOX],
    iconAnchor: [MARKER_BOX / 2, MARKER_BOX / 2],
  });
}

export function buildLocationPopupHtml(location: {
  name: string;
  address?: string;
  categoryName?: string;
  rating?: string;
  detailHref: string;
  mapsHref: string;
  detailLabel: string;
  mapsLabel: string;
}) {
  const rating = Number.parseFloat(location.rating || "0").toFixed(1);

  return `
    <div style="min-width:200px;font-family:system-ui,sans-serif">
      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0f172a;line-height:1.3">
        ${escapeHtml(location.name)}
      </p>
      ${
        location.categoryName
          ? `<p style="margin:0 0 4px;font-size:11px;color:#64748b">${escapeHtml(location.categoryName)}</p>`
          : ""
      }
      ${
        location.address
          ? `<p style="margin:0 0 8px;font-size:11px;color:#94a3b8;line-height:1.4">${escapeHtml(location.address)}</p>`
          : ""
      }
      <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#f59e0b">⭐ ${rating}</p>
      <div style="display:flex;gap:6px">
        <a href="${location.detailHref}" style="flex:1;text-align:center;padding:6px 8px;border-radius:8px;background:#ff385c;color:#fff;font-size:11px;font-weight:700;text-decoration:none">
          ${escapeHtml(location.detailLabel)}
        </a>
        <a href="${location.mapsHref}" target="_blank" rel="noopener noreferrer" style="flex:1;text-align:center;padding:6px 8px;border-radius:8px;background:#ecfdf5;color:#047857;border:1px solid #d1fae5;font-size:11px;font-weight:700;text-decoration:none">
          ${escapeHtml(location.mapsLabel)}
        </a>
      </div>
    </div>
  `;
}
