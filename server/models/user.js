'use strict';

module.exports = function(User) {
  /**Validation*/
  User.validatesUniquenessOf('phoneNumber', {message: 'Phone Number has to be unique.'});
  /**-------------------------------- End ------------------------------------*/

  /**---------------------------- SignIn user --------------------------------*/
  User.remoteMethod('signIn', {
    accepts: {
      arg: 'credentials',
      type: {
        phoneNumber: 'string',
        password: 'string',
      },
      required: true,
      http: {source: 'body'},
    },
    returns: {
      arg: 'app user',
      type: {
        id: 'string',
        imageUrl: 'string',
        firstName: 'string',
        lastName: 'string',
        phoneNumber: 'string',
        companyName: 'string',
        accountType: 'string',
        categories: [
          'string',
        ],
        businessDetailsId: 'string',
        bankDetailsId: 'string',
      },
      root: true,
    },
    description: 'Returns app user if exists',
  });

  User.signIn = async function(credentials) {
    const fetchedUserResponse = await User.findOne({
      where: {phoneNumber: {eq: credentials.phoneNumber}},
      include: ["bankDetail","businessDetail"]
    });
    if (fetchedUserResponse != undefined) {
      const fetchedUserJson = fetchedUserResponse.toJSON()
      if (fetchedUserJson.password === fetchedUserJson.password) {
        return {
          id: fetchedUserJson.id,
          imageUrl: fetchedUserJson.imageUrl,
          firstName: fetchedUserJson.firstName,
          lastName: fetchedUserJson.lastName,
          phoneNumber: fetchedUserJson.phoneNumber,
          companyName: fetchedUserJson.businessDetail.companyName,
          accountType: fetchedUserJson.businessDetail.accountType,
          categories: fetchedUserJson.businessDetail.categories,
          businessDetailId: fetchedUserJson.businessDetail.id,
          bankDetailId: fetchedUserJson.bankDetail.id,
        };
      } else {
        throw Error('Incorrect password');
      }
    } else {
      throw Error('User not found');
    }
  };
  /**-------------------------------- End ------------------------------------*/

  /**---------------------------- SignUp user --------------------------------*/
  User.remoteMethod('addUser', {
    accepts: {
      arg: 'user',
      type: {
        phoneNumber: 'string',
        accountType: 'string',
        categories: [
          'string',
        ],
        firstName: 'string',
        lastName: 'string',
        companyName: 'string',
        password: 'string',
      },
      required: true,
      http: {source: 'body'},
    },
    returns: {
      arg: 'user',
      type: {
        id: 'string',
        imageUrl: 'string',
        firstName: 'string',
        lastName: 'string',
        phoneNumber: 'string',
        companyName: 'string',
        accountType: 'string',
        categories: [
          'string',
        ],
        businessDetailsId: 'string',
        bankDetailsId: 'string',
      },
      root: true,
    },
    description: 'Adds new user with corresponding bank and business details',
  });

  User.addUser = async function(user) {
    if (
      !(user.firstName === undefined ||
        user.phoneNumber === undefined ||
        user.password === undefined ||
        user.companyName === undefined ||
        user.accountType === undefined ||
        user.categories.length === 0
      )
    ) {
      const registeredWithPhoneNumber = await User.findOne({where: {phoneNumber: {eq: user.phoneNumber}}});
      if (registeredWithPhoneNumber == undefined) {
        const newUser = await User.create(
          {
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            country: user.country,
            city: user.city,
            email: user.email,
            website: user.website,
            password: user.password
          },
        );

        const businessDetail = await User.app.models.businessDetail.create(
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
            userId: newUser.id,
          },
        );

        const bankDetail = await User.app.models.bankDetail.create(
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
            userId: newUser.id,
          },
        );

        return {
          id: newUser.id,
          imageUrl: newUser.imageUrl,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phoneNumber: newUser.phoneNumber,
          companyName: businessDetail.companyName,
          accountType: businessDetail.accountType,
          categories: businessDetail.categories,
          businessDetailId: businessDetail.id,
          bankDetailId: bankDetail.id,
        };
      } else {
        throw Error('Phone number has to be unique');
      }
    } else {
      throw Error('First name, Phone number and password are required to create a user.');
    }
  };
  /**-------------------------------- End ------------------------------------*/

  /**------------------------- Check phone number ----------------------------*/
  User.remoteMethod('checkPhoneNumber', {
    accepts: {
      arg: 'phoneNumber',
      type: 'string',
      required: true,
    },
    returns: {
      arg: 'exists',
      type: 'boolean',
      root: true,
    },
    http: {path: '/checkPhoneNumber/:phoneNumber', verb: 'post'},
    description: 'Checks if phone number is registered',
  });

  User.checkPhoneNumber = async function(phoneNumber) {
    const searchedUser = await User.findOne({where: {phoneNumber: phoneNumber}});
    return searchedUser != undefined;
  };
};

/*
TODO in production mood:
    - hide unused default methods
    - hide disable api explorer
*/

