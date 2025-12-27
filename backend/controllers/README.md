# Backend Controllers Overview

This folder contains controller files for each backend feature:

- `authController.js`: User authentication (signup, login)
- `equipmentController.js`: Equipment CRUD, scrap, requests per equipment
- `requestController.js`: Maintenance requests CRUD, assign technician, update stage, duration, calendar view
- `teamController.js`: Maintenance teams CRUD, add technician, list teams with members
- `reportingController.js`: Reporting/analytics/statistics endpoints
- `workCenterController.js`: Work centers CRUD
- `threedEquipmentController.js`: 3D equipment CRUD

All controllers are separated from routes for clarity and maintainability. Integrate with frontend as needed.
