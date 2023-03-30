import { Router } from "express";
import ioControllerObject from "../socket";

const router = Router();

router.get("/", () => {
  console.log(ioControllerObject.getIO());
});

export default router;
