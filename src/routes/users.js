const router = require('koa-router')()

const { register, login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../res-module/index')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/user')

// router.get('/', function (ctx, next) {
//   ctx.body = 'this is a users response!'
// })

// router.get('/bar', function (ctx, next) {
//   ctx.body = 'this is a users/bar response'
// })

router.post('/register', async function (ctx, next) {
  const userInfo = ctx.request.body
  const { username, password } = userInfo
  try
  {
    await register(username, password)
    // 返回成功
    ctx.body = new SuccessModel()
  } catch (ex)
  {
    console.error(ex)
    // 返回失败
    ctx.body = new ErrorModel(10001, `注册失败 - ${ex.message}`)
  }
})

router.post('/login', async function (ctx, next) {
  // console.log(ctx.request.body)
  const { username, password } = ctx.request.body
  // 登录验证
  const res = await login(username, password)
  if (res)
  {
    const _id = res._id
    // If successfully Login, set session.userInfo
    ctx.session.userInfo = {
      username, _id
    }

    // Return seccess
    ctx.body = new SuccessModel()
  } else
  {
    // Return failure
    ctx.body = new ErrorModel(10002, `登录验证失败`)
  }
})

router.get('/info', loginCheck, async function (ctx, next) {
  // 加了 loginChenck 之后，因为保证了必须登录
  const session = ctx.session
  ctx.body = new SuccessModel(session.userInfo)
})

module.exports = router
