import localUpload from "../common/utils/multer/multer.config.js";
import {
  processFields,
  processFile,
  processFiles,
  deleteUploadedFiles,
} from "../common/utils/multer/multer.service.js";

export async function checkFileContent({
  req,
  acceptedFileTypes = [],
  folderName,
}) {
  if (req.file) {
    await processFile({ file: req.file, acceptedFileTypes, folderName });
  } else if (Array.isArray(req.files)) {
    await processFiles({ files: req.files, acceptedFileTypes, folderName });
  } else if (typeof req.files === "object") {
    await processFields({ fields: req.files, acceptedFileTypes, folderName });
  }
}

export function handelFileMiddleware({
  multerMiddleware,
  folderName,
  acceptedFileTypes,
} = {}) {
  return async (req, res, next) => {
    const customNext = async (error) => {
      if (error) {
        // multer error (e.g. file too large) — clean up any files already saved
        await deleteUploadedFiles(req);
        next(error);
        return;
      }

      try {
        await checkFileContent({
          req,
          folderName,
          acceptedFileTypes,
        });
        next();
      } catch (error) {
        // validation error — clean up all uploaded files
        await deleteUploadedFiles(req);
        next(error);
      }
    };

    return multerMiddleware(req, res, customNext);
  };
}
