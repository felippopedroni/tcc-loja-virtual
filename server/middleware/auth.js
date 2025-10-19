import jwt from "jsonwebtoken";

const auth = async (request, response, next) => {
    try {
        const token =
            request.cookies.accessToken ||
            request?.headers?.authorization?.split(" ")[1];

        if (!token) {
            return response.status(401).json({
                message: "PROVIDENCIA SEU TOKEN DE ACESSO",
                error: true,
                success: false,
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN_SECRET);

        if (!decode) {
            return response.status(401).json({
                message: "ACESSO NAO AUTORIZADO",
                error: true,
                success: false,
            });
        }

        request.userId = decode.id;
        
        next();
    } catch (error) {
        return response.status(500).json({
            message: "VOCE NAO ESTA LOGADO",
            error: true,
            success: false,
        });
    }
};

export default auth;