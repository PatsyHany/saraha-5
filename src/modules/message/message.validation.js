import * as z from "zod";
import { validationFields } from "../../common/validation.js";
import { MessageTypeEnum } from "../../common/enum/message.enum.js";

export const sendMessageSchema = (lang) => {
  return z
    .object({
      body: z.object({
        content: z.string().min(3).max(1000).optional(),
        receiverId: validationFields(lang).id,
      }),
      files: z.any().optional(),
    })
    .refine(
      (value) => {
        return value.body.content || value.files?.length;
      },
      { error: "Add a message" },
    );
};

export const DeleteMessageSchema = (lang) => {
  return z.object({
    params: z.object({
      messageId: validationFields(lang).id,
    }),
  });
};

export const getMessageByIdSchema = (lang) => {
  return z.object({
    params: z.object({
      messageId: validationFields(lang).id,
    }),
  });
};

export const getAllMessagesSchema = (lang) => {
  return z.object({
    query: z.object({
      page: z.coerce.number().min(1).max(999).default(1),
      limit: z.coerce.number().min(5).max(999).default(5),
      filterType: z.literal(Object.values(MessageTypeEnum)).optional(),
    }),
  });
};
