import express from "express";
const colaborators = require ("../controllers/colaborators")
const routes = express();

routes.post('/collaborators', colaborators.collaboratorCode);
routes.post('/register/entry', colaborators.registerEntry);
routes.post('/register/exit', colaborators.registerExit);
routes.get('/history/:contributor_code', colaborators.getRegisters);


export default routes;