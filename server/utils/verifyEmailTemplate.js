const verifyEmailTemplate = ({ name, url }) => {
  return `
    <p>Prezado ${name}</p>
    <p>Obrigado por se Cadastrar no nosso site</p>
    <a href="${url}" style="color:black;background:orange;margin-top:10px;padding:20px;display:block">
      Verify Email
    </a>
  `;
};

export default verifyEmailTemplate;