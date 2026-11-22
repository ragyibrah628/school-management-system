// Shared printed letterhead: District Council logo on the LEFT, school logo on the RIGHT,
// school/council names in the centre. Used by every printed document.
export const DISTRICT_LOGO_KEY = 'sms_district_logo';

export const getDistrictLogo = (): string => {
  try { return localStorage.getItem(DISTRICT_LOGO_KEY) || ''; } catch { return ''; }
};

export const getSchoolLogo = (): string => {
  try { return localStorage.getItem('sms_school_logo') || ''; } catch { return ''; }
};

export const LETTERHEAD_CSS = `
.lh-row{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%}
.lh-center{flex:1 1 auto;min-width:0;text-align:center}
.lh-side{flex:0 0 auto;width:80px;height:64px;display:flex;align-items:center;justify-content:center}
.lh-side img{display:block;width:auto!important;height:auto!important;max-width:80px!important;max-height:64px!important;object-fit:contain;margin:0!important}
`;

const side = (src: string) => src
  ? `<div class="lh-side"><img src="${src}" alt="" /></div>`
  : `<div class="lh-side"></div>`;

// Opens the letterhead: <style>, row, left (district) logo and the centre text block.
// Write your council / school name / title lines after this, then call letterheadClose().
export const letterheadOpen = (districtLogo: string): string =>
  `<style>${LETTERHEAD_CSS}</style><div class="lh-row">${side(districtLogo)}<div class="lh-center">`;

// Closes the centre block and adds the right (school) logo.
export const letterheadClose = (schoolLogo: string): string =>
  `</div>${side(schoolLogo)}</div>`;
