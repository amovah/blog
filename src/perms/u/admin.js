// Must be admin or super admin
export default (req, res, next) => {
  req.member.user.type >= 3 ? next() : res.reply.forbidden();
};
