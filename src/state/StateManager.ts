import { UserState } from "../types/UserState";

const states = new Map<number, UserState>();

export class StateManager {

    static get(userId: number): UserState {

        return states.get(userId) ?? UserState.IDLE;

    }

    static set(userId: number, state: UserState) {

        states.set(userId, state);

    }

    static clear(userId: number) {

        states.delete(userId);

    }

}