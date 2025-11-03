import jwt from "jsonwebtoken"
const authenticate = (req,res,next)=>{
  const token = req.cookies.token
  if (!token){return res.render("login", {errors: ['Please log in, session expired']})}
  try {
    req.user = jwt.verify(token,process.env.JWT_SECRET)
    next();
  } catch (error) {
    res.render("login", {errors: ['Expired login token']})
  }
}
export {authenticate};