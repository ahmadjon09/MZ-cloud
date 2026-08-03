/**
 * Search Controller
 */
const searchService = require('../services/search.service');

class SearchController {
  async search(req, res, next) {
    try {
      const query = req.query.q || req.query.search || '';
      const options = {
        category: req.query.category || 'ALL',
        folderId: req.query.folderId,
        tag: req.query.tag,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc',
        limit: parseInt(req.query.limit || '30', 10),
        offset: parseInt(req.query.offset || '0', 10)
      };

      const result = await searchService.globalSearch(req.user.id, query, options);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SearchController();
