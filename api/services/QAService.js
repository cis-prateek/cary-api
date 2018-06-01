const async = require('async');
// var ObjectId = require('mongodb').ObjectID;
var nestedPop = require('nested-pop');
const _ = require('lodash');

exports.saveQuestions = async (req, res) => {
  let body = req.body;
  body.createdBy = req.user.id;
  if (body.userId !== req.user.id) {
    return res.json({
      result: 0,
      message: 'Authentication Error.'
    });
  }
  if (!body.categoryId) {
    return res.json({
      result: 0,
      message: 'category Id required'
    });
  }
  if (!body.subCategoryIds) {
    return res.json({
      result: 0,
      message: 'sub-category Id required'
    });
  }
  // const subCategoryIds = body.subCategoryIds;
  // if (typeof subCategoryIds === 'object' && !subCategoryIds.length) {
  //     return res.json({
  //         result: 0,
  //         message: 'Atleaset one sub category must be selected'
  //     });
  // }

  // const category = await __getCategoryById(body.categoryId);

  // if (!category) {
  //     return res.json({
  //         result: 0,
  //         message: 'Invailid category Id'
  //     });
  // }

  // const subCategory = await __getSubCategoryById(body.subCategoryIds);

  // if (!subCategory) {
  //     return res.json({
  //         result: 0,
  //         message: 'Invailid sub-category Id'
  //     });
  // }

  // if (subCategory.parentId !== body.categoryId) {
  //     return res.json({
  //         result: 0,
  //         message: 'Invalid Sub Category for the category'
  //     });
  // }

  let questionsData = [],
    questionIds = [];

  async.series([(callback1) => {
    if (body.questions.length >= 1) {
      questionsData.push({
        title: body.questions[0],
        createdBy: body.createdBy,
        categoryId: body.categoryId,
        subCategoryIds: body.subCategoryIds
      });
      callback1();
    } else {
      callback1();
    }
  },
  (callback2) => {
    if (body.questions.length >= 2) {
      questionsData.push({
        title: body.questions[1],
        createdBy: body.createdBy,
        categoryId: body.categoryId,
        subCategoryIds: body.subCategoryIds
      });
      callback2();
    } else {
      callback2();
    }
  },
  (callback3) => {
    if (body.questions.length >= 3) {
      questionsData.push({
        title: body.questions[2],
        createdBy: body.createdBy,
        categoryId: body.categoryId,
        subCategoryIds: body.subCategoryIds
      });
      callback3();
    } else {
      callback3();
    }
  }, (callback4) => {
    if (questionsData.length !== body.questions.length) {
      callback4({
        message: 'Invailid question bunch inforamation, Not Accept more than 3 questions'
      });
    } else {
      // Questions.create(questionsData, (errr, questions) => {
      //   if (errr) {
      //     callback4(errr);
      //   } else {
      //     questions.forEach((val, index) => {
      //       questionIds.push(val.id);
      //       if (questions.length == index + 1) {
      //         callback4();
      //       }
      //     });
      //   }
      // });
      let questionsRes = [];
      async.each(questionsData, function (question, asyCallback){
        Questions.find()
          .sort('createdAt DESC')
          .limit(1)
          .exec(function (err, ques){
            question.counter = +new Date();
            console.log('xxxxxxxxxxxxxxxxxxxx', question);
            Questions.create(question)
              .exec(function (err, createdQuestion){
                questionsRes.push(createdQuestion);
                asyCallback();
              });
          });
      },function (err){
        questionsRes.forEach((val, index) => {
          questionIds.push(val.id);
          if (questionsRes.length == index + 1) {
            callback4();
          }
        });
      });
    }
  }], (callbackError, response) => {
    if (callbackError) {
      res.json({
        result: 0,
        error: callbackError,
        message: 'Error Occurs'
      });
    } else {
      QuestionBunch.create({
        questions: questionIds,
        createdBy: body.createdBy,
        categoryId: body.categoryId
      }).exec((err, question) => {
        if (err) {
          res.json({
            result: 0,
            error: err,
            message: 'Error Occurs'
          });
        } else {
          res.json({
            result: 1,
            message: 'Successfully Saved.'
          });
        }
      });
    }
  });
};

exports.saveAnswer = async (req, res) => {
  let body = req.body;
  body.createdBy = req.user.id;
  if (!body.questionId) {
    return res.json({
      result: 0,
      message: 'questionId required'
    });
  }

  const question = await __getQuestionById(body.questionId);

  if (!question) {
    return res.json({
      result: 0,
      message: 'Invailid question Id'
    });
  }

  Answers.create(body).exec((err, question) => {
    if (err) {
      res.json({
        result: 0,
        error: err,
        message: 'Error Occurs'
      });
    } else {
      res.json({
        result: 1,
        message: 'Answer successfully added.'
      });
    }
  });
};

exports.getAllQuestions = async (req, res) => {
  req.body = req.body || {

  };
  const limit = req.body.limit,
    skip = req.body.skip;
  let response = [];
  const ObjectId = objectIdService.ObjectId;
  try {
    const countOfAllBunchs = await QuestionBunch.count();
    if (countOfAllBunchs < Number(skip)) {
      return res.json(200, {
        result: 1,
        data: []
      });
    } else {
      const currentUserQuestions = await QuestionBunch.find({
        where: {
          createdBy: new ObjectId(req.user.id || req.body.userId)
        },
        skip: Number(skip),
        limit: Number(limit),
        sort: 'createdAt DESC'
      })
        .populate('categoryId')
        .populate('createdBy');
      let otherUserQuestions = [];

      // if (currentUserQuestions.length >= limit) {
      //     return res.status(200).send({
      //     result: 1,
      //     data: currentUserQuestions
      //   });
      // } else {
      if(currentUserQuestions.length < limit) {
        otherUserQuestions = await QuestionBunch.find({
          where: {
            createdBy: {
              '!=': [new ObjectId(req.user.id || req.body.userId)]
            }
          },
          skip: (((skip - currentUserQuestions.length) < 0) ? 0 : (skip - currentUserQuestions.length)),
          limit: limit - currentUserQuestions.length,
          sort: 'createdAt DESC'
        })
          .populate('categoryId')
          .populate('createdBy');

      }
      const allQuestions = [];
      async.each(currentUserQuestions.concat(otherUserQuestions), (info, callback) => {
        if (!info || !info['createdBy']) {
          callback({
            message: 'Invailid Request'
          });
        } else {
          Profile.findOne({
            userId: (info['createdBy'] ? info['createdBy']['id'] : '')
          }).exec((err, profile) => {
            if (err) {
              callback(err);
            } else {
              const infoJSOn = Object.assign(info, {
                userName: '',
                userAvatarUrl: null
              });
              if (profile) {
                infoJSOn.userName = profile.name;
                infoJSOn.nick_name = profile.nick_name;
                infoJSOn.userAvatarUrl = profile.avatarUrl;
                allQuestions.push(infoJSOn);
              } else {
                allQuestions.push(infoJSOn);
              }
              callback();
            }
          });
        }
      }, (error, respo) => {
        if (error) {
          res.json(201, {
            result: 0,
            error: error,
            message: 'Error Occurs.'
          });
        } else {
          res.json(200, {
            result: 1,
            data: allQuestions
          });
        }
      });
    }
  }
  catch (e) {
    res.json(201, {
      result: 0,
      error: e,
      message: 'Error Occurs.'
    });
  }
};

exports.getAllQuestionsBySelectedCategories = async (req, res) => {
  const limit = req.body.limit,
    skip = req.body.skip;
  let response = [];
  const ObjectId = objectIdService.ObjectId;
  try {
    const usersCategories = await UsersCategories.findOne({
      user_id: req.user.id
    });
    if (!(usersCategories && usersCategories.categories && usersCategories.categories.length)) {
      return res.status(201).json({
        result: 1,
        data: []
      });
    }

    const selectedCatIds = await _.map(usersCategories.categories, (val) => {
      return val.category_id;
    });

    const countOfAllBunchs = await QuestionBunch.count();
    if (countOfAllBunchs < Number(skip)) {
      return res.json(200, {
        result: 1,
        data: []
      });
    } else {
      const currentUserQuestions = await QuestionBunch.find({
        where: {
          createdBy: new ObjectId(req.user.id || req.body.userId),
          categoryId: selectedCatIds
        },
        skip: Number(skip),
        limit: Number(limit),
        sort: 'createdAt DESC'
      })
        .populate('categoryId')
        .populate('createdBy');
      let otherUserQuestions = [];

      //if (currentUserQuestions.length >= limit) {
      //  return res.status(200).send({
      //    result: 1,
      //    data: currentUserQuestions
      //  });
      //} else {
      if (currentUserQuestions.length < limit) {
        otherUserQuestions = await QuestionBunch.find({
          where: {
            createdBy: {
              '!=': [new ObjectId(req.user.id || req.body.userId)],
              categoryId: selectedCatIds
            }
          },
          skip: (((skip - currentUserQuestions.length) < 0) ? 0 : (skip - currentUserQuestions.length)),
          limit: limit - currentUserQuestions.length,
          sort: 'createdAt DESC'
        })
          .populate('categoryId')
          .populate('createdBy');

      }
      const allQuestions = [];
      async.each(currentUserQuestions.concat(otherUserQuestions), (info, callback) => {
        if (!info || !info['createdBy']) {
          callback({
            message: 'Invailid Request'
          });
        } else {
          Profile.findOne({
            userId: (info['createdBy'] ? info['createdBy']['id'] : '')
          }).exec((err, profile) => {
            if (err) {
              callback(err);
            } else {
              const infoJSOn = Object.assign(info, {
                userName: '',
                userAvatarUrl: null
              });
              if (profile) {
                infoJSOn.userName = profile.name;
                infoJSOn.userAvatarUrl = profile.avatarUrl;
                infoJSOn.nickName = profile.nick_name ? profile.nick_name : null;
                allQuestions.push(infoJSOn);
              } else {
                allQuestions.push(infoJSOn);
              }
              callback();
            }
          });
        }
      }, (error, respo) => {
        if (error) {
          res.json(201, {
            result: 0,
            error: error,
            message: 'Error Occurs.'
          });
        } else {
          res.json(200, {
            result: 1,
            data: allQuestions
          });
        }
      });
    }
  }
  catch (e) {
    res.json(201, {
      result: 0,
      error: e,
      message: 'Error Occurs.'
    });
  }
};

exports.getQuestionById = (req, res) => {
  Questions.findById(req.params.id).exec((err, question) => {
    if (err) {
      res.json({
        result: 0,
        error: err,
        message: 'Error Occurs'
      });
    } else {
      Profile.findOne({
        userId: question.createdBy
      }).exec((err, profile) => {
        if (profile) {
          res.json(200, {
            result: 1,
            data: Object.assign(question, {
              userName: profile.name,
              userAvatarUrl: profile.avatarUrl
            })
          });
        } else {
          res.json(200, {
            result: 1,
            data: Object.assign(question, {
              userName: 'NA',
              avatarUrl: null
            })
          });
        }
      });
    }
  });
};

exports.getAnswersByQuestionId = (req, res) => {
  Answers.find({
    questionId: req.params.questionId
  }).exec((err, answers) => {
    if (err) {
      res.json({
        result: 0,
        error: err,
        message: 'Error Occurs'
      });
    } else {
      Profile.findOne({
        userId: answers.createdBy
      }).exec((err, profile) => {
        answers.userName = '';
        if (profile) {
          res.json(200, {
            result: 1,
            data: Object.assign(answers, {
              userName: profile.name,
              userAvatarUrl: profile.avatarUrl
            })
          });
        } else {
          res.json({
            result: 0,
            error: err,
            message: 'Error Occurs'
          });
        }
      });
    }
  });
};

// function for returning question and its related answers as per the QUESTION-BUNCH id.
exports.getQuestionAnswerByQuestionBunchId = async (req, res) => {
  try {
    // get all question by QUESTION-BUNCH id
    const questionsList = await QuestionBunch.findOne(req.params.questionBunchId);
    const questions = questionsList ? questionsList.questions : [];
    Questions.findByIdIn(questions)
      .populate('answers')
      .sort('id ASC')
      .exec((err, questions) => {
        if (err) {
          res.json(400, {
            result: 1,
            data: err
          });
        } else {
          const questData = [];
          async.each(questions, function (ques, callback) {
            const answers = [];
            const time = ques.id.toString().substring(0,8);

            ques.time = time;
            User.findOneById(ques.createdBy)
              .exec((err, user) => {
                Profile.findOne()
                  .where({
                    userId: ques.createdBy
                  })
                  .exec((err, profile) => {
                    ques.userProfile = profile;
                    async.each(ques.answers, function (ans, callback1) {
                      Profile.findOne()
                        .where({
                          userId: ans.createdBy
                        })
                        .exec((err, userProfile) => {
                          ans.userProfile = userProfile;
                          answers.push(ans);
                          callback1();
                        });
                    }, function (err) {
                      ques.answers = answers;
                      questData.push(ques);
                      callback();
                    });
                  });
              });

          }, function (err) {
            res.json(200, {
              result: 1,
              data: questData
            });
          });
        }
      });
  } catch (e) {
    res.json(201, {
      result: 0,
      error: e,
      message: 'Error Occurs.'
    });
  }
};

exports.getQuestionWithAnswersBySelectedCategories = async (req, res) => {
  try {
    // get all question by QUESTION-BUNCH id
    const questionsList = await QuestionBunch.findOne(req.params.id);
    const questions = questionsList ? questionsList.questions : [];
    Questions.findByIdIn(questions)
      .populate('answers')
      .sort('id ASC')
      .exec((err, questions) => {
        if (err) {
          res.json(400, {
            result: 1,
            data: err
          });
        } else {
          const questData = [];
          async.each(questions, function (ques, callback) {
            const answers = [];
            User.findOneById(ques.createdBy)
              .exec((err, user) => {
                Profile.findOne()
                  .where({
                    userId: ques.createdBy
                  })
                  .exec((err, profile) => {
                    ques.userProfile = profile;
                    async.each(ques.answers, function (ans, callback1) {
                      if (ans.createdBy == req.user.id) {
                        Profile.findOne()
                          .where({
                            userId: ans.createdBy
                          })
                          .exec((err, userProfile) => {
                            ans.userProfile = userProfile;
                            answers.push(ans);
                            callback1();
                          });
                      } else {
                        callback1();
                      }
                    }, function (err) {
                      ques.answers = answers;
                      questData.push(ques);
                      callback();
                    });
                  });
              });

          }, function (err) {
            res.json(200, {
              result: 1,
              data: questData
            });
          });
        }
      });
  } catch (e) {
    res.json(201, {
      result: 0,
      error: e,
      message: 'Error Occurs.'
    });
  }
};

async function __getCategoryById (categoryId) {
  let response;
  try {
    response = await Category.findOneById(categoryId);
  }
  catch (e) {
    return null;
  }

  return response;
};

async function __getSubCategoryById (subCategoryId) {
  let response;
  try {
    response = await Category.findOneById(subCategoryId);
  }
  catch (e) {
    return null;
  }

  return response;
};

async function __getQuestionById (questionId) {
  let response;
  try {
    response = await Questions.findOneById(questionId);
  }
  catch (e) {
    return null;
  }

  return response;
};
