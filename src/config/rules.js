const THRESHOLD = 60000;
const DATEFORMAT = 'YYYY-MM-DDTHH:mm:ss.sssZZ';

const SIM_STATUS = {
  NEW: 'new',
  ASSIGNED: 'assigned',
  RECLAIMED: 'reclaimed',
};

const SIM_TELECOM_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  DISCONNECTED: 'disconnected',
};

module.exports = {
  THRESHOLD,
  DATEFORMAT,
  SIM_STATUS,
  SIM_TELECOM_STATUS,
};
