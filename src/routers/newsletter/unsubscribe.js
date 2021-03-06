import { Router } from 'express';

const { Newsletter } = rootRequire('./models');
const { email } = rootRequire('./utils');

const router = new Router();

router.get('/unsubscribe', (req, res) => {
  res.render('newsletter/unsubscribe.njk');
});

router.post('/unsubscribe', async(req, res) => {
  req.body.email = req.body.email.toLowerCase();
  req.body.captcha = req.body.captcha.toLowerCase();

  if (req.body.captcha === req.session.captcha) {

    const member = await Newsletter.findOne({ email: req.body.email });

    if (member) {
      email.unsubscribe(req.body.email, member._id).then(() => {
        req.session.captcha = null;
        res.json({ type: 0 });
      }).catch(() => {
        // Error in Sending Email
        res.json({ type: 2, text: 2 });
      });
    } else {
      // User not found in Newsletter
      res.json({ type: 2, text: 1 });
    }
  } else {
    // Wrong Captcha
    res.json({ type: 2, text: 0 });
  }
});

router.get('/unsubscribe/:token', async(req, res) => {
  const member = await Newsletter.findOne({ _id: req.params.token });
  
  if (member) {
    member.remove().then(() => {
      res.render('newsletter/unsubscribe.njk', { done: true });
    }).catch(() => {
      res.reply.notFound();
    });
  } else {
    res.reply.notFound();
  }
});

export default router;
