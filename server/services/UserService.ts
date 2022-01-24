import HttpException from "../exceptions/HttpException";
import User from "../models/User";

class UserService {
    async reg(googleId: number, username: string) {
        const user = await User.findOne({
            $or: [
                { username: username },
                // { googleId: googleId }
            ]
        })
        if (user) {
            throw new HttpException(HttpException.CONFLICT, "user with this username already exists");
        }

        const newUser = await User.create({ googleId: googleId, username: username });
        return newUser;
    }

    async login(googleId: number) {
        const user = await User.findOne({ googleId: googleId });
        if (!user) {
            throw new HttpException(HttpException.NOT_FOUND, "user not found");
        }

        return user;
    }
}

export default new UserService();