import authenticated from '@utils/authentication/authenticated';
import { GET as get } from './get';
import { POST as post } from './post';

const GET = authenticated(get);
const POST = authenticated(post);

export { GET, POST };
