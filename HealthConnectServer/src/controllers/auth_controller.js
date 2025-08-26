const User = require("../config/models/user")
const sendOTPCode = require("../utils/sendOTP")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  try {
    const { 
      role,
      email,
      fullname,
      contact,
      emergencyContact,
      password,
      confirmPassword,
      birthdate,
      license,
      specialization,
      gender,
      allergies,
      bloodType,
      medicalConditions
    } = req.body
    //Check the database if user credentials provided already exist
    const existingUsernameDetails = await User.findOne({ email, contact })
    if(existingUsernameDetails) return res.status(409).json({ message: 'User already exist' })

    //check if password has atleast one uppercase, one number and a symbol and also minimum of eight characters long
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z0-9!@#$%^&*()_+-|{}]{8,}$/
    if(!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must contain at least one uppercase, one number, one special character and must be at least 8 characters long ' 
      })
    }
    
    //Hashing user password before saving to database for security reasons
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    const hashedconfPassword = await bcrypt.hash(confirmPassword, salt)
    if(hashedPassword !== hashedconfPassword) return res.status(409).json({ message: 'Passwords do not match' })
    const userProfileImage = req?.file?.path

    //Save new user to the database
    const user = new User({ 
      role,
      email,
      contact,
      fullname,
      emergencyContact,
      password: hashedPassword,
      profileImage: userProfileImage,
      gender
    }) 

    if(role === 'doctor') {
      user.license = license
      user.specialization = specialization
    } else {
      user.birthdate = birthdate
      user.bloodType = bloodType
      user.allergies = allergies
      user.medicalConditions = medicalConditions
    }   
    await user.save()

    // send verificaion mail after saving the user object
    await sendOTPCode(user, res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const verifyOTP = async (req, res) => {
  const { id } = req.params
  const { otp } = req.body
  try {
    const user = await User.findById(id)
    
    if(!user || user?.token !== otp) {  
      return res.status(404).json({ message: 'Invalid or expired code' })
    }

    if (new Date(user.createdAt).getTime() + 15 * 60 * 1000 < Date.now()) {
      user.token = undefined  
      return res.status(401).json({ message: 'OTP expired' })
    }

    user.isAuthenticated = true
    user.token = undefined
    user.save()

    res.status(201).json({ message: 'Sign up complete, please login'})
  } catch(err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}


const login = async (req, res) => {
  const { email, password, rememberMe } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required!' })
  }
  const foundUser = await User.findOne({ email }).exec()
  if (!foundUser) {
    return res
      .status(401)
      .json({ message: 'Wrong credentials entered', ok: false })
  }

  if(!foundUser.isAuthenticated) return res.status(403).json({ unVerified: true, message: 'Please verify your email to login' })
  try {
    const isValidated = bcrypt.compareSync(password, foundUser.password)
    if (!isValidated) {
      return res
        .status(401)
        .json({ message: 'Wrong credentials entered!', ok: false })
    }

    const accessToken = jwt.sign({
        email,
        role: foundUser.role,
        _id: foundUser._id
      },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '15d' }
    )

    const { 
      password: pass, 
      ...rest 
    } = foundUser._doc

    return res.status(200).json({
      message: `User ${foundUser.fullname} successfully logged in!`,
      user: { ...rest, accessToken }
    })
  } catch (error) {
    console.log(error)
    return res
      .status(401)
      .json({ message: 'Error while logging in', ok: false })
  }
}



module.exports = {
  register,
  verifyOTP,
  login
}