import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;  

    if (!uri) {
      throw new Error("esta string de banco de dados nao esta no arquivo .env");
    }
    await mongoose.connect(uri);
    console.log(" Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
};
export default connectDB;
