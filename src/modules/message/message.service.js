import { MessageTypeEnum } from "../../common/enum/message.enum";
import { NotFoundException } from "../../common/exceptions/app.exceptions";
import {
  createOneDoc,
  deleteDoc,
  findAndCountAllDoc,
  findByIdDoc,
  findOneDoc,
} from "../../DB/db.repo";
import messageModel from "../../DB/models/message.model";
import userModel from "../../DB/models/user.model";

export async function sendMessage(bodyData, filesData, user) {
  const { content, receiverId } = bodyData;

  const receiver = await findByIdDoc({ model: userModel, id: receiverId });

  if (!receiver) {
    throw NotFoundException({ errMsg: "User Not Found" });
  }

  const finalPaths = filesData?.map((file) => {
    return file.finalPath;
  });

  const newMessage = await createOneDoc({
    model: messageModel,
    insertedData: {
      content,
      attachments: finalPaths,
      senderId: user?.id,
      receiverId,
    },
  });

  return newMessage;
}

export async function deleteMessage(messageId, user) {
  const message = await deleteDoc({
    model: messageModel,
    filter: { _id: messageId, receiverId: user.id },
  });

  if (!message.deletedCount) {
    throw NotFoundException({ errMsg: "Message Not Found" });
  }
}

export async function getMessageById(messageId, user) {
  const message = await findOneDoc({
    model: messageModel,
    filter: {
      _id: messageId,
      $or: [{ receiverId: user.id }, { senderId: user.id }],
    },
  });

  if (!message) {
    throw NotFoundException({ errMsg: "Message Not Found" });
  }

  return message;
}

export async function getAllMessages(queryData, user) {
  const { page, limit, filterType } = queryData;

  let queryFilter;

  switch (filterType) {
    case MessageTypeEnum.RECEIVER:
      queryFilter = { receiverId: user.id };
      break;

    case MessageTypeEnum.SENDER:
      queryFilter = { senderId: user.id };
      break;

    default:
      queryFilter = { $or: [{ receiverId: user.id }, { senderId: user.id }] };
      break;
  }

  const { docs, count } = await findAndCountAllDoc({
    model: messageModel,
    filter: queryFilter,
    pagination: { page, limit },
  });

  if (!docs.length) {
    throw NotFoundException({ errMsg: "No Message Found" });
  }
  return {
    messages: docs,
    currantPage: page,
    maxPerPage: limit,
    totalMessages: count,
    totalPages: Math.ceil(count / limit),
  };
}
