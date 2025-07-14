import sequelize from './config/database.js';
import express from 'express';
import bodyParser from 'body-parser';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  } finally {
    await sequelize.close();
  }
})();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/version', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database ok');
    app.listen(port, () => {
      console.log(`Server ok port ${port}`);

    });
  })
  .catch((error) => {
    console.error('Erro ao conectar:', error);
  });