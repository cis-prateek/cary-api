/**
 * NewsFeedController
 *
 * @description :: Server-side logic for managing Newsfeeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addNewsFeed: (req, res) => {
    NewsFeedService.addNewsFeed(req, res);
  },
  getNewsFeed: (req, res) => {
    NewsFeedService.getNewsFees(req, res);
  },
  getNewsFeedById: (req, res) => {
    NewsFeedService.getNewsFeedById(req, res);
  },
  getRatting: (req, res) => {
    NewsFeedService.getRating(req, res);
  },
  deleteNewsFeed: (req, res) => {
    NewsFeedService.deleteNewsFeed(req, res);
  },
  editNewsFeed: (req, res) => {
    NewsFeedService.editNewsFeed(req, res);
  }
};

