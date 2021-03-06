import { Router } from 'express';

const { Article, Member, Conference } = rootRequire('./models');
const { moment } = rootRequire('./utils');

const router = new Router();

router.get('/', async(req, res) => {

  const doc = await Article.find({}).sort({ createdAt: -1 }).limit(20);

  if (doc.length === 0) {
    res.render('home.njk', {
      empty: true
    });
  } else {

    const articles = [];
    const lastConf = { provider: {} };

    function* getResponse() {
      for (const i of doc) {

        yield new Promise(async resolve => {
          let content = i.content.split('').slice(0, 130);
          content.push('.', '.', '.');
          content = content.join('');

          const oneArticle = {
            _id: i._id,
            title: i.title,
            createdAt: moment(i.createdAt),
            likes: i.likes.length,
            viewers: i.viewers.length,
            avatar: i.avatar,
            author: {},
            content
          };

          const member = await Member.findOne({ _id: i.author });

          if (member) {
            oneArticle.author.fname = member.fname;
            oneArticle.author.lname = member.lname;
            oneArticle.author.username = member.username;
            oneArticle.author.avatar = member.avatar;

            articles.push(oneArticle);
            resolve();
          } else {
            res.reply.error();
          }
        });
      }

      yield new Promise(async resolve => {

        const conf = await Conference
                .find({ type: { $in: [3, 4] } })
                .sort({ createdAt: -1 })
                .limit(1);

        if (conf.length === 0) {
          lastConf.empty = true;
          resolve();
        } else {
          lastConf.title = conf[0].title;
          lastConf.description = conf[0].description;
          lastConf.avatar = conf[0].avatar;
          lastConf.createdAt = moment(conf[0].createdAt);

          const provider = await Member.findOne({ _id: conf[0].provider });

          if (provider) {
            lastConf.provider.fname = provider.fname;
            lastConf.provider.lname = provider.lname;
            lastConf.provider.username = provider.username;
            lastConf.provider.avatar = provider.avatar;
          }
          resolve();
        }
      });
    }

    const iterator = getResponse();
    (function loop() {

      const next = iterator.next();
      if (next.done) {
        res.render('home.njk', { posts: articles, lastConf });
        return;
      }

      next.value.then(loop);
    })();
  }
});

export default router;
