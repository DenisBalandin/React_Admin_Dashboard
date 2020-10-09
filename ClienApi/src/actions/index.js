import {ACCESS_TOKEN} from "../constants/action-types";
import {USERS_ITEMS} from "../constants/action-types";
import {CHANGE_USER} from "../constants/action-types";
import {DELETE_USER} from "../constants/action-types";
import {DELETE_STORE} from "../constants/action-types";
import {ADD_MESSAGE} from "../constants/action-types";

export function addMessage(payload) {
    return { type: "ADD_MESSAGE", payload }
};
export function addToken(payload) {
    return { type: "ACCESS_TOKEN", payload }
};
export function addUsers(payload) {
    return { type: "USERS_ITEMS", payload }
};
export function changeUser(payload) {
    return { type: "CHANGE_USER", payload }
};
export function deleteUser(payload) {
    return { type: "DELETE_USER", payload }
};
export function deleteStorer(payload) {
    return { type: "DELETE_STORE", payload }
};


