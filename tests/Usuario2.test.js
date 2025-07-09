import { expect } from 'chai';
import { db } from './setup.js';

describe('Usuario Model - Testes adicionais', () => {
  it('Deve criar um usuário com data_nascimento e email válidos', async () => {
    const usuario = await db.Usuario.create({
      login: 'usuario_data_email',
      nome: 'Usuário Data Email',
      data_nascimento: '1990-05-20',
      email: 'usuario@email.com',
    });

    expect(usuario).to.have.property('id');
    expect(usuario.data_nascimento).to.equal('1990-05-20');
    expect(usuario.email).to.equal('usuario@email.com');
  });

  it('Deve permitir criar usuário sem data_nascimento e email (campos opcionais)', async () => {
    const usuario = await db.Usuario.create({
      login: 'usuario_opcional',
      nome: 'Usuário Opcional',
    });

    expect(usuario).to.have.property('id');
    expect(usuario.data_nascimento).to.be.null;
    expect(usuario.email).to.be.null;
  });

  it('Não deve criar usuário com email em formato inválido', async () => {
    try {
      await db.Usuario.create({
        login: 'usuario_email_errado',
        nome: 'Usuário Email Errado',
        email: 'email-invalido',
      });
      expect.fail('Deveria ter lançado um erro de validação de email');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
      expect(error.message).to.include('Validation isEmail on email failed');
    }
  });

  it('Não deve criar usuário com login maior que 50 caracteres', async () => {
    try {
      await db.Usuario.create({
        login: 'a'.repeat(51),
        nome: 'Usuário Login Longo',
      });
      expect.fail('Deveria ter lançado um erro de validação de login');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve criar usuário com nome maior que 100 caracteres', async () => {
    try {
      await db.Usuario.create({
        login: 'usuario_nome_longo',
        nome: 'a'.repeat(101),
      });
      expect.fail('Deveria ter lançado um erro de validação de nome');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });
});
