class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const requireQuery = { ...this.queryString };
    for (const key in requireQuery) {
      if (typeof requireQuery[key] === 'object' && requireQuery[key] !== null) {
        const innerObj = requireQuery[key];
        for (const innerKey in innerObj) {
          innerObj[`$${innerKey}`] = innerObj[innerKey];
          delete innerObj[innerKey];
        }
      }
    }

    const excludedFields = ['sort', 'page', 'limit', 'fields'];

    excludedFields.forEach((el) => delete requireQuery[el]);

    this.query = this.query.find(requireQuery);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const requiredFields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(requiredFields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
