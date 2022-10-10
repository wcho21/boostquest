class PageNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
exports.PageNotFoundError = PageNotFoundError;

exports.pageNotFoundErrorCreator = (req, res) => {
  throw new PageNotFoundError();
};

