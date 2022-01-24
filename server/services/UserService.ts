import HttpException from "../exceotions/HttpException";
import User from "../models/User";

class UserService {
    async reg(googleId: number, username: string) {
        // const user = await User.findOne({
        //     $or: [
        //         { username: username },
        //         { googleId: googleId }
        //     ]
        // })
        // if (user) {
        //     throw new HttpException(HttpException.CONFLICT, "user exist");
        // }

        const newUser = await User.create({ googleId: googleId, username: username });
        return newUser;
    }
}

export default new UserService();