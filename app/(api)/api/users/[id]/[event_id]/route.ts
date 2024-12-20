import authenticated from '@utils/authentication/authenticated';
import { POST as post } from './post';
import { DELETE as del } from './delete';

const POST = authenticated(post);
const DELETE = authenticated(del);

export { POST, DELETE };
