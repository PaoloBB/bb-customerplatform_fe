import memoize from 'lru-memoize';
import { createValidator, required } from 'utils/validation';

const organizationValidation = createValidator({
  name: [required]
});
export default memoize(10)(organizationValidation);
