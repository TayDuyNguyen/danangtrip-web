import L from "leaflet";

const VIETNAM_FLAG_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" width="30" height="20" aria-hidden="true">
    <rect width="30" height="20" fill="#DA251D" rx="2"/>
    <polygon fill="#FFCD00" points="15,3.5 17.1,9.3 23.3,9.3 18.1,12.9 20.2,18.7 15,15.1 9.8,18.7 11.9,12.9 6.7,9.3 12.9,9.3"/>
  </svg>
`;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function createSovereigntyMarkerIcon(title: string, claim: string) {
  const safeTitle = escapeHtml(title);
  const safeClaim = escapeHtml(claim);

  return L.divIcon({
    className: "explore-sovereignty-marker",
    html: `
      <div class="explore-sovereignty-marker__wrap">
        <div class="explore-sovereignty-marker__flag" title="${safeTitle}">
          ${VIETNAM_FLAG_SVG}
        </div>
        <div class="explore-sovereignty-marker__label">
          <strong>${safeTitle}</strong>
          <span>${safeClaim}</span>
        </div>
      </div>
    `,
    iconSize: [168, 72],
    iconAnchor: [84, 36],
  });
}

export function buildSovereigntyPopupHtml(title: string, claim: string) {
  return `
    <div class="explore-sovereignty-popup">
      <div class="explore-sovereignty-popup__flag">${VIETNAM_FLAG_SVG}</div>
      <p class="explore-sovereignty-popup__title">${escapeHtml(title)}</p>
      <p class="explore-sovereignty-popup__claim">${escapeHtml(claim)}</p>
    </div>
  `;
}
