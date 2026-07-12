import { UserRepository } from "../database/repositories/UserRepository";
import { UserState } from "../enums/UserState";
export class UserService {

    static getUser(telegramId: number) {
        return UserRepository.findByTelegramId(telegramId);
    }

    static createUser(user: {
        telegramId: number;
        username?: string;
        firstName?: string;
        lastName?: string;
        licenseId: number;
    }) {
        UserRepository.create({
            ...user,
            state: UserState.WAITING_GROUP
        });
    }

    static updateState(telegramId: number, state: string) {
        UserRepository.updateState(telegramId, state);
    }

}