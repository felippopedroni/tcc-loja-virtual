const forgotPasswordTemplate = ({ name, otp }) => { 
    return `
    <div>
        <p>Prezado, ${name}</p> 
        <p>Você foi solicitado a redefinir sua senha. Use o seguinte código OTP para redefinir sua senha.</p> 
        <div style="background:yellow; font-size:20px;padding:20px;text-align:center;font-weight: 800;">
            ${otp} 
        </div>
        <p>Este otp é válido por apenas 1 hora. Insira este otp no site TCC para prosseguir com a lefinição</p> 
        <br/>
        <p>Obrigado</p> 
        <p>TCC</p> 
    </div>
    `
}

export default forgotPasswordTemplate 