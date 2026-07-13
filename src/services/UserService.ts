import { UserRepository } from "../database/repositories/UserRepository";
import { UserState } from "../enums/UserState";

export class UserService {

    static getUser(
        telegramId: number
    ) {

        return UserRepository.findByTelegramId(
            telegramId
        );

    }


    static createUser(user: {

        telegramId: number;

        username?: string;

        firstName?: string;

        lastName?: string;

        licenseId?: number | null;

        state?: UserState;

    }) {

        UserRepository.create({

            telegramId:

                user.telegramId,

            username:

                user.username,

            firstName:

                user.firstName,

            lastName:

                user.lastName,

            licenseId:

                user.licenseId ?? null,

            state:

                user.state ?? UserState.WAITING_GROUP

        });

    }


    static createOwner(
        user: {
            telegramId: number;
            username?: string;
            firstName?: string;
            lastName?: string;
        }
    ) {

        UserRepository.create({

            telegramId:

                user.telegramId,

            username:

                user.username,

            firstName:

                user.firstName,

            lastName:

                user.lastName,

            licenseId:

                null,

            state:

                UserState.READY

        });

    }


    static updateState(
        telegramId: number,
        state: UserState
    ) {

        UserRepository.updateState(
            telegramId,
            state
        );

    }

}