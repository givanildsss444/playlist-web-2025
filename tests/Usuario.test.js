import { expect } from 'chai';
import { sequelize, db } from './setup.js';

describe('Usuario Model', () => {
  it('Deve criar um usuário com dados válidos', async () => {
    const usuario = await db.Usuario.create({
      login: 'teste123',
      nome: 'Usuário Teste',
    });

    expect(usuario).to.have.property('id');
    expect(usuario.login).to.equal('teste123');
    expect(usuario.nome).to.equal('Usuário Teste');
  });

  it('Não deve criar um usuário com login duplicado', async () => {
    await db.Usuario.create({
      login: 'duplicado',
      nome: 'Usuário 1',
    });

    try {
      await db.Usuario.create({
        login: 'duplicado',
        nome: 'Usuário 2',
      });
      expect.fail('Deveria ter lançado um erro de unicidade');
    } catch (error) {
      expect(error.name).to.equal('SequelizeUniqueConstraintError');
    }
  });

  it('Não deve criar um usuário sem login', async () => {
    try {
      await db.Usuario.create({
        nome: 'Usuário Sem Login',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve criar um usuário sem nome', async () => {
    try {
      await db.Usuario.create({
        login: 'sem_nome',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });
  
  it('Deve permitir criar múltiplos usuários distintos', async () => {
    const usuario1 = await db.Usuario.create({ login: 'multi01', nome: 'Usuário 1' });
    const usuario2 = await db.Usuario.create({ login: 'multi02', nome: 'Usuário 2' });

    expect(usuario1.login).to.not.equal(usuario2.login);
    expect(usuario1.nome).to.not.equal(usuario2.nome);
  });
});