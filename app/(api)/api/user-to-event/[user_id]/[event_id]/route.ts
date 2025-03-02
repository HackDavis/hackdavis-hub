import authenticated from '@utils/authentication/authenticated';
// import { PUT as put } from './put';
// import { GET as get } from './get';
import { DELETE as del } from './delete';

const DELETE = authenticated(del);

export { DELETE };
