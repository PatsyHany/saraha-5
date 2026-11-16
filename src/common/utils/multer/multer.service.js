import { mkdir, readFile, writeFile, unlink } from "fs/promises";
import { resolve } from "path";
import { fileTypeFromBuffer } from "file-type";
import { BadRequestException } from "../../exceptions/app.exceptions.js";
import { randomUUID } from "crypto";

export async function deleteFile(filePath) {
  try {
    await unlink(resolve(filePath));
  } catch {
    // file may already be gone — ignore
  }
}

export async function deleteUploadedFiles(req) {
  if (req.file) {
    await deleteFile(req.file.finalPath || req.file.path);
  } else if (Array.isArray(req.files)) {
    await Promise.all(
      req.files.map((f) => deleteFile(f.finalPath || f.path))
    );
  } else if (req.files && typeof req.files === "object") {
    const allFiles = Object.values(req.files).flat();
    await Promise.all(
      allFiles.map((f) => deleteFile(f.finalPath || f.path))
    );
  }
}

export async function processFile({
  file,
  acceptedFileTypes,
  folderName = "General",
}) {
  let fileContent;

  if (file.path) {
    const filePath = file.path;
    fileContent = await readFile(resolve(filePath));
  } else {
    fileContent = file.buffer;
  }

  const actualFileType = await fileTypeFromBuffer(fileContent);

  if (
    !actualFileType ||
    (acceptedFileTypes.length &&
      !acceptedFileTypes.includes(actualFileType.mime))
  ) {
    throw BadRequestException({ errMsg: "Invalid Actual File Format" });
  }

  if (!file.path) {
    const dirPath = `./assets/${folderName}`;
    const finalPath = `${dirPath}/${randomUUID()}.${actualFileType.ext}`;

    await mkdir(dirPath, { recursive: true });
    await writeFile(resolve(finalPath), fileContent);

    file.finalPath = finalPath;
  } else {
    file.finalPath = file.path;
  }
}

export async function processFiles({
  files,
  acceptedFileTypes,
  folderName = "General",
}) {
  for (const file of files) {
    await processFile({ file, acceptedFileTypes, folderName });
  }
}

export async function processFields({
  fields,
  acceptedFileTypes,
  folderName = "General",
}) {
  for (const key of Object.keys(fields)) {
    await processFiles({ files: fields[key], acceptedFileTypes, folderName });
  }
}
