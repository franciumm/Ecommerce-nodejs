import {Router} from 'express';
import * as UserStart from './controller/User.Start.js'
import * as UserMailConfirm from './controller/Emailer.js'
import * as Joi from './Validations.js'
import {allowedExtensions} from '../utils/allowedExtensions.js'
import {multerCloudFunction} from '../utils/MulterCloud.js'
import Joivalidation from '../middelwares/JoiValidation.js';
import * as PasswordC from './controller/password.js'

const router = Router ();

router.post ('/signup',multerCloudFunction(allowedExtensions.image).single('image'),Joivalidation(Joi.signup),UserStart.Signup);
router.get('/confirmEmail/:email', UserMailConfirm.confirmEmail);
router.get('/newConfirmEmail/:email',UserMailConfirm.newConfirmEmail);
router.post('/login',Joivalidation(Joi.Login),UserStart.Login );
router.post ('/forget',PasswordC.forgetPassword);
router.post ('/reset/:token',PasswordC.ResetPassword);
export default router;
