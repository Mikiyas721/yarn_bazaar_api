'use strict';

module.exports = function(Yarn) {
  Yarn.remoteMethod('yarnsOfUser', {
    accepts: {
      arg: 'userId',
      type: 'string',
      required: true,
    },
    returns: {
      arg: 'yarns',
      type: [
        'object',
      ],
      root: true,
    },
    http: {path: '/yarnsOfUser/:userId', verb: 'post'},
    description: 'Fetches yarns of the user who id is specified',
  });

  Yarn.yarnsOfUser = async function(userId) {
    return await Yarn.find({where: {userId: userId}});
  };
};
