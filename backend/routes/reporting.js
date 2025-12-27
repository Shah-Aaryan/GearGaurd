import express from 'express';
import {
  getTechnicianWorkload,
  getRequestVolumeTrend,
  getEquipmentBreakdowns,
  getMaintenanceTypeImpact,
  getRequestAging,
  getTeamProductivity
} from '../controllers/reportingController.js';

const router = express.Router();

router.get('/technician-workload', getTechnicianWorkload);
router.get('/request-volume-trend', getRequestVolumeTrend);
router.get('/equipment-breakdowns', getEquipmentBreakdowns);
router.get('/maintenance-type-impact', getMaintenanceTypeImpact);
router.get('/request-aging', getRequestAging);
router.get('/team-productivity', getTeamProductivity);

export default router;
