import { Router } from "express";
import ioControllerObject from "../socket";

const router = Router();

router.get("/", () => {
  ioControllerObject.getIO().emit("messages", {
    action: "create",
    message:
      "some message is here from the backend, but could be accepted trough the props",
  });
});

export default router;
