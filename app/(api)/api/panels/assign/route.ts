import authenticated from '@utils/authentication/authenticated';
import { POST as post } from './post';

const POST = authenticated(post);

export { POST };
