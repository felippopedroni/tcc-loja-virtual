import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RESEND_API) {
    throw new Error('A chave RESEND_API não está no arquivo .env');
}
const resend = new Resend(process.env.RESEND_API);
const sendEMail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Erro do Resend:', { error });
            return;
        }

        console.log('E-mail enviado com sucesso:', data);
        return data;
    } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
    }
};

export default sendEMail;
