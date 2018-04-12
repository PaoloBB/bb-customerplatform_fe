import memoize from 'lru-memoize';
import { createValidator, required } from 'utils/validation';

const registerValidation = createValidator({
  password: required
});
export default memoize(10)(registerValidation);
