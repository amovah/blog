import { Router } from 'express';

const { Member } = rootRequire('./models');
const { login } = rootRequire('./perms');
const { crypt } = rootRequire('./utils');

const router = new Router();

router.get('/login', login, (req, res) => {
  res.render('login.njk');
});

router.post('/login', login, async(req, res) => {
  req.body.email = req.body.email.toLowerCase();
  req.body.captcha = req.body.captcha.toLowerCase();

  if (req.body.captcha === req.session.captcha) {

    const member = await Member.findOne({ email: req.body.email });

    if (member) {

      if (crypt.decrypt(member.password, member.email) ===
      req.body.password) {

        if (member.type === 1) {
          // Account is deactive
          res.json({ type: 1, text: 0 });
        } else {
          req.member.login(member);
          // OK
          req.session.captcha = null;
          res.json({ type: 0 });
        }

      } else {
        // Wrong Password
        res.json({ type: 2, text: 0 });
      }
    } else {
      // User Not Found
      res.json({ type: 2, text: 1 });
    }
  } else {
    // Wrong Captcha
    res.json({ type: 2, text: 3 });
  }
});

export default router;
