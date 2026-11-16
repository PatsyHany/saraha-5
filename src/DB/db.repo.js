export async function findAndCountAllDoc({
  model,
  filter = {},
  projection,
  pagination = { limit: 5, page: 1 },
  populate = "",
} = {}) {
  const query = model.find(filter, projection);

  if (populate) {
    query.populate(populate);
  }
  if (pagination) {
    const { limit, page } = pagination;

    const skip = (page - 1) * limit;

    query.skip(skip);
    query.limit(limit);
  }

  return {
    data: await query.exec(),
    count: await model.countDocuments(filter),
  };
}

export async function findOneDoc({ model, filter = {}, projection } = {}) {
  return model.findOne(filter, projection);
}

export async function createOneDoc({ model, insertedData, options } = {}) {
  const [doc] = await model.create([insertedData], options);
  return doc;
}
export async function findByIdDoc({ model, id, projection } = {}) {
  return model.findById(id, projection);
}

export async function deleteDoc({ model, filter } = {}) {
  return model.deleteOne(filter);
}
