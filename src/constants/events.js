/**
 * Global Custom Events
 * Dùng để giao tiếp giữa utils (axios, helpers)
 * và UI (React components, Modals, Layouts)
 */

/** Auth */
export const OPEN_LOGIN_MODAL = "OPEN_LOGIN_MODAL";
export const CLOSE_LOGIN_MODAL = "CLOSE_LOGIN_MODAL";

/** Post / Thread */
export const OPEN_CREATE_POST_MODAL = "OPEN_CREATE_POST_MODAL";
export const OPEN_REPLY_MODAL = "OPEN_REPLY_MODAL";

/** User actions */
export const OPEN_FOLLOW_MODAL = "OPEN_FOLLOW_MODAL";
export const OPEN_REPORT_MODAL = "OPEN_REPORT_MODAL";

/** System */
export const LOGOUT_EVENT = "LOGOUT_EVENT";
