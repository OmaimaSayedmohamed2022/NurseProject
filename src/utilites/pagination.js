const pagination = async (model, query, page = 1, limit = 14, sort = {}, select = '', populate = '') => {
  const skip = (parseInt(page) - 1) * limit;

  let mongooseQuery = model.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  if (select) mongooseQuery = mongooseQuery.select(select);
  if (populate) mongooseQuery = mongooseQuery.populate(populate);

  const items = await mongooseQuery;
  const totalItems = await model.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  return { items, totalPages, totalItems, page: parseInt(page) };
};

export default pagination;
