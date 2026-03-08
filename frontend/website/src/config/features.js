const parseBool = (value) => {
  if (value === undefined || value === null) return false;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
};

const explicitQgisFlag = import.meta.env.VITE_ENABLE_QGIS_ANALYSIS;

// Default: enabled in local dev, disabled in production unless explicitly enabled.
export const ENABLE_QGIS_ANALYSIS =
  explicitQgisFlag === undefined ? import.meta.env.DEV : parseBool(explicitQgisFlag);
