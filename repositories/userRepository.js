const UserModel = require('../models/user');
const User = require('../models/user');

//const logger = require('../logger');

const timestamp = new Date();

const userRepository = {
  async getUserByEmail(email) {
    try {
      const result = await UserModel.findOne({ email });

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
     * @param handle {string}
     * @param type {"phone" | "email" | "facebook"}
     * @return {Promise<Query<Document<unknown, any, unknown> & Omit<unknown extends {_id?: infer U} ? IfAny<U, {_id: Types.ObjectId}, Required<{_id: U}>> : {_id: Types.ObjectId}, never> & {}, Document<unknown, any, unknown> & Omit<unknown extends {_id?: infer U} ? IfAny<U, {_id: Types.ObjectId}, Required<{_id: U}>> : {_id: Types.ObjectId}, never> & {}, {}, unknown> & {}>}
     */
  async getUserByTypeAndHandle(handle, type) {
    try {
      const result = await UserModel.findOne({ [type]: handle });

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getUserByPhone(phone) {
    try {
      const result = await UserModel.findOne({ mobile_no: phone });

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const result = await UserModel.findOne({ _id: userId });

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async createUser(data) {
    try {
      const newUser = new UserModel(data);
      const result = await newUser.save();

      //logger.info('User created successfully', { result, timestamp });
      return result;
    } catch (error) {
      //logger.error('Error creating user', { error });
      console.error(error);
      throw error;
    }
  },

  async updateUser(userId, data) {
    try {
      const result = await UserModel.findOneAndUpdate({ _id: userId }, data, { new: true });

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getByCompany(companyId) {
    try {
      const result = await UserModel.find({ company_id: companyId });

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getAll(options) {
    try {
      const regex = new RegExp(options.search, 'i');

      const aggregate = User.aggregate([
        {
          $sort: {
            [options.sortBy]: options.sortDirection,
          },
        },
        {
          $match: {
            $and: [
              {
                $or: [
                  { first_name: regex },
                  { last_name: regex },
                  { user_name: regex },
                  { email: regex },
                  { birthdate: regex },
                  { status: regex },
                  { mobile_no: regex },
                ],
              },
            ],
          },
        },
      ]);

      return await User.aggregatePaginate(aggregate, options);
    } catch (error) {
      console.log('List Individual User error', error);
      throw error;
    }
  },
};

module.exports = userRepository;
