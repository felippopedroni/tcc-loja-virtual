import UserModel from '../models/user.model.js';
import sendEMail from '../config/sendEmail.js';
import bcrypt from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/gerenatedAccesstoken.js';
import generatedRefreshToken from '../utils/gerenatedRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import generatedOtp from '../utils/generatedOtp.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import jwt from 'jsonwebtoken';
export async function registerUserController(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "todos campos obrigatorios",
                error: true,
                sucess: false
            });
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "email ja existe",
                error: true,
                sucess: false
            });
        }
        //verificar se o usuario ja existe


        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        //O Hash é o método que transforma a senha em um código seguro e o salt é um valor aleatorio q é adicionado para a proteção de hash.

        const payload = {
            name,
            email,
            password: hashPassword
        };//criptografar a senha
        const newUser = await UserModel(payload);
        const save = await newUser.save();
        //salvar o usuario no banco de dados
        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

        const verifyEmail = await sendEMail({
            sendTo: email,
            subject: "verifique seu email",
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl,
            })
        });

        return res.json({
            message: "usuario cadastrado com sucesso",
            error: false,
            sucess: true,
            data: save,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            sucess: false
        });
    }
}

export async function verifyEmailController(req, res) {
    try {
        const { code } = req.query;
        const user = await UserModel.findOne({ _id: code });
        if (!user) {
            return res.status(400).json({
                message: "codigo de verificação é obrigatorio",
                error: true,
                sucess: false
            });
        }
        const updateUser = await UserModel.findOneAndUpdate(
            { _id: code },
            { verify_email: true }
        );
        return res.json({
            message: "email verificado com sucesso",
            sucess: true,
            error: false
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            sucess: false
        });
    }
}

export async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "todos campos obrigatorios",
                error: true,
                sucess: false
            });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "este usuario nao existe",
                error: true,
                sucess: false
            });
        }

        if (user.status !== "Active") {
            return res.status(400).json({
                message: "entra em contato com seu administrador",
                error: true,
                sucess: false
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({
                message: "senha incorreta",
                error: true,
                sucess: false
            });
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        await UserModel.findByIdAndUpdate(user._id, {
            refresh_token: refreshToken
        });


        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };
        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);


        return res.json({
            message: "login realizado com sucesso",
            error: false,
            sucess: true,
            data: {
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            sucess: false
        });
    }
}


export async function logoutController(request, response) {
    try {
        const userId = request.userId

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.clearCookie("accessToken", cookiesOption)
        response.clearCookie("refreshToken", cookiesOption)


        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        })


        return response.json({
            message: "SAINDO DO SISTEMA COM SEGURANÇA",
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function uploadAvatar(request, response) {
    try {
        const userId = request.userId
        const image = request.file

        const upload = await uploadImageCloudinary(image)

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return response.json({
            message: "carregando perfil",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId
        const { name, email, mobile, password } = request.body
        let hashPassword = ""

        if (password) {
            const salt = await bcrypt.genSalt(10)
            hashPassword = await bcrypt.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword })
        })

        return response.json({
            message: "ATUALIZADO COM SUCESSO",
            error: false,
            success: true,
            data: updateUser
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body
        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "E-mail não disponível",
                error: true,
                success: false
            })
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000 // 1 hora de expiração 

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEMail({
            sendTo: email,
            subject: "ESQUECEU SUA SENHA? TCC",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return response.json({
            message: "FAVOR CHECAR SEU EMAIL",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body

        if (!email || !otp) {
            return response.status(400).json({
                message: "Forneça o campo obrigatório e-mail, otp.",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "E-mail não disponível",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString()

        // Verifica se o OTP expirou
        if (user.forgot_password_expiry < currentTime) {
            return response.status(400).json({
                message: "Otp expirou",
                error: true,
                success: false
            })
        }

        // Verifica se o OTP é inválido
        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "OTP inválido",
                error: true,
                success: false
            })
        }

        // Limpa o OTP e a expiração no DB após a verificação bem-sucedida
        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        })

        return response.json({
            message: "Verificou do otp com sucesso",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function resetPassword(request, response) { //
    try {
        const { email, newPassword, confirmPassword } = request.body

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "forneça os campos obrigatórios e-mail, nova senha, confirme a senha",
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "O e-mail não está disponível",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "A nova senha e a confirmação da senha devem ser as mesmas.",
                error: true,
                success: false,
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)

        const update = await UserModel.findOneAndUpdate(user._id, {
            password: hashPassword
        })

        return response.json({
            message: "Senha atualizada com sucesso.",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function refreshToken(request, response) { 
    try {
        // Tenta obter o refresh token dos cookies ou do cabeçalho de autorização
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1] 

        if (!refreshToken) { 
            return response.status(401).json({ 
                message: "Token inválido", 
                error: true, 
                success: false 
            })
        }

        // Verifica se o refresh token é válido
        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN) 

        if (!verifyToken) { 
            return response.status(401).json({ 
                message: "o token expirou", 
                error: true, 
                success: false 
            })
        }

        const userId = verifyToken?._id 

        const newAccessToken = await generatedAccessToken(userId) 

        const cookiesOption = { 
            httpOnly: true, 
            secure: true, 
            sameSite: "None" 
        }

        response.cookie('accessToken', newAccessToken, cookiesOption) 

        return response.json({ 
            message: "Novo token de acesso gerado", 
            error: false, 
            success: true, 
            data: { 
                accessToken: newAccessToken 
            }
        })

    } catch (error) { 
        return response.status(500).json({ 
            message: error.message || error, 
            error: true, 
            success: false 
        })
    }
}