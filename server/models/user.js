'use strict';

module.exports = function(User) {
  /**Add User method*/
  User.remoteMethod('addUser', {
    accepts: {
      arg: 'user',
      type: {
        imageUrl: 'string',
        firstName: 'string',
        lastName: 'string',
        phoneNumber: 'string',
        country: 'string',
        city: 'string',
        email: 'string',
        website: 'string',
        password: 'string',
        companyName: 'string',
        accountType: 'string',
        categories: [
          'string',
        ],
        address: 'string',
        completeAddress: 'string',
        gstNo: 'string',
        tanNo: 'string',
        gstDocumentUrl: 'string',
        panNo: 'string',
        panCardUrl: 'string',
        accountName: 'string',
        accountNumber: 'number',
        iFSCCode: 'string',
        bankName: 'string',
        bankBranch: 'string',
        bankState: 'string',
        bankCity: 'string',
        addressProofUrl: 'string',
        cancelledChequeUrl: 'string',
      },
      required: true,
      http: {source: 'body'},
    },
    returns: {
      arg: 'user',
      type: 'object',
      root: true,
    },
    description: 'Adds user a corresponding bank and business details',
  });

  User.addUser = async function(user) {
    if (
      !(user.firstName === undefined ||
        user.phoneNumber === undefined ||
        user.password === undefined)
    ) {
      const businessDetails = await User.app.models.businessDetail.create(
        {
          companyName: user.companyName,
          accountType: user.accountType,
          categories: user.categories,
          address: user.address,
          completeAddress: user.completeAddress,
          gstNo: user.gstNo,
          tanNo: user.tanNo,
          gstDocumentUrl: user.gstDocumentUrl,
          panNo: user.panNo,
          panCardUrl: user.panCardUrl,
        },
      );
      const bankDetails = await User.app.models.bankDetail.create(
        {
          accountName: user.accountName,
          accountNumber: user.accountNumber,
          iFSCCode: user.iFSCCode,
          bankName: user.bankName,
          bankBranch: user.bankBranch,
          bankState: user.bankState,
          bankCity: user.bankCity,
          addressProofUrl: user.addressProofUrl,
          cancelledChequeUrl: user.cancelledChequeUrl,
        },
      );

      return await User.create(
        {
          imageUrl: user.imageUrl,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          country: user.country,
          city: user.city,
          email: user.email,
          website: user.website,
          password: user.password,
          businessDetailId: businessDetails.id,
          bankDetailId: bankDetails.id,
        },
      );
    } else {
      throw Error('firstName, phoneNumber and password are required to create a user.');
    }
  };

  /**Get fullUserInformation method*/
  User.remoteMethod('fullUserInformation', {
    accepts: {
      arg: 'userId',
      type: 'string',
      required: true,
    },
    returns: {
      arg: 'user',
      type: 'object',
      root: true,
    },
    http: {path: '/fullUserInformation/:userId', verb: 'post'},
    description: 'Fetches full user information',
  });

  User.fullUserInformation = async function(userId) {
    const user = await User.findOne({where: {id: {eq: userId}}});
    if (user == undefined) throw Error('user not found');
    else {
      const businessDetails = await User.app.models.businessDetail.findOne({where: {id: {eq: user.businessDetailId}}});
      const bankDetails = await User.app.models.bankDetail.findOne({where: {id: {eq: user.bankDetailId}}});
      return {
        imageUrl: user.imageUrl,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        country: user.country,
        city: user.city,
        email: user.email,
        website: user.website,
        password: user.password,
        companyName: businessDetails.companyName,
        accountType: businessDetails.accountType,
        categories: businessDetails.categories,
        address: businessDetails.address,
        completeAddress: businessDetails.completeAddress,
        gstNo: businessDetails.gstNo,
        tanNo: businessDetails.tanNo,
        gstDocumentUrl: businessDetails.gstDocumentUrl,
        panNo: businessDetails.panNo,
        panCardUrl: businessDetails.panCardUrl,
        accountName: bankDetails.accountName,
        accountNumber: bankDetails.accountNumber,
        iFSCCode: bankDetails.iFSCCode,
        bankName: bankDetails.bankName,
        bankBranch: bankDetails.bankBranch,
        bankState: bankDetails.bankState,
        bankCity: bankDetails.bankCity,
        addressProofUrl: bankDetails.addressProofUrl,
        cancelledChequeUrl: bankDetails.cancelledChequeUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
  };
};

/*
TODO in production mood:
    - hide unused default methods
    - hide disable api explorer
*/

