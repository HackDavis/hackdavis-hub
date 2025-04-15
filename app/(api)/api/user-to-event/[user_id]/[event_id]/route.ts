import authenticated from "@utils/authentication/authenticated";
import { GET as get } from "./get";
import { POST as post } from "./post";
import { DELETE as del } from "./delete";

const GET = authenticated(get);
const POST = authenticated(post);
const DELETE = authenticated(del);

export { GET, POST, DELETE };
