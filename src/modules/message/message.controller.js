import { Router } from "express";
import auth from "../../middleware/authentication.middleware";
import {
  deleteMessage,
  getAllMessages,
  getMessageById,
} from "./message.service";
import validation from "../../middleware/validation.middleware";
import {
  DeleteMessageSchema,
  getAllMessagesSchema,
  getMessageByIdSchema,
  sendMessageSchema,
} from "./message.validation";

const messageRouter = Router();

messageRouter.post(
  "/",
  (req, res, next) => {
    if (req.headers.authorization) {
      return auth()(req, res, next);
    }
    next();
  },
  handelFileMiddleware({
    multerMiddleware: localUpload({ fileSize: 5, folderName: "Message" }),
    folderName: "Message",
  }),
  validation(sendMessageSchema),
  async (req, res) => {
    const result = await sendMessage(req.body, req.files, req.user);
    successResponse({ res, status: 201, data: result });
  },
);

messageRouter.delete(
  "/:messageId",
  validation(DeleteMessageSchema),
  auth(),
  async (req, res) => {
    const result = await deleteMessage(req.params.messageId, req.user);
    successResponse({ res, status: 200, data: result });
  },
);

messageRouter.get(
  "/:messageId",
  validation(getMessageByIdSchema),
  auth(),
  async (req, res) => {
    const result = await getMessageById(req.params.messageId, req.user);
    successResponse({ res, status: 200, data: result });
  },
);

messageRouter.get(
  "/",
  validation(getAllMessagesSchema),
  auth(),
  async (req, res) => {
    const result = await getAllMessages(req.validateData.query, req.user);
    successResponse({ res, data: result });
  },
);

export default messageRouter;
