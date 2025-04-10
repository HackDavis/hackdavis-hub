import authenticated from '@utils/authentication/authenticated';
import { GET as get } from './get';
import { PUT as put } from './put';
import { DELETE as del } from './delete';

const GET = authenticated(get);
const PUT = authenticated(put);
const DELETE = authenticated(del);

export { GET, PUT, DELETE };
