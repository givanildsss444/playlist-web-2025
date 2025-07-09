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
        expect(error.errors[0].path).to.equal('email');
        expect(error.errors[0].validatorKey).to.equal('isEmail');
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

});
