import { expect } from 'chai';
import { db } from './setup.js';

describe('Mensalidade Model - Testes adicionais', () => {

  it('Deve atualizar o status da mensalidade', async () => {
    const usuario = await db.Usuario.create({ login: 'update_teste', nome: 'Teste Update' });

    const mensalidade = await db.Mensalidade.create({
      id_usuario: usuario.id,
      valor: 50.00,
      data_pagamento: null,
      ano_mes: '2024-05',
      status: 'pendente',
    });

    mensalidade.status = 'pago';
    await mensalidade.save();

    const atualizada = await db.Mensalidade.findByPk(mensalidade.id);
    expect(atualizada.status).to.equal('pago');
  });

  it('Deve excluir uma mensalidade', async () => {
    const usuario = await db.Usuario.create({ login: 'delete_teste', nome: 'Teste Delete' });

    const mensalidade = await db.Mensalidade.create({
      id_usuario: usuario.id,
      valor: 70.00,
      ano_mes: '2024-06',
      status: 'pendente',
    });

    const id = mensalidade.id;
    await mensalidade.destroy();

    const encontrada = await db.Mensalidade.findByPk(id);
    expect(encontrada).to.be.null;
  });

  it('Deve buscar mensalidades com status "atrasado"', async () => {
    const usuario = await db.Usuario.create({ login: 'filtro_teste', nome: 'Filtro Teste' });

    await db.Mensalidade.create({
      id_usuario: usuario.id,
      valor: 30.00,
      ano_mes: '2024-07',
      status: 'atrasado',
    });

    await db.Mensalidade.create({
      id_usuario: usuario.id,
      valor: 40.00,
      ano_mes: '2024-08',
      status: 'pago',
    });

    const atrasados = await db.Mensalidade.findAll({ where: { status: 'atrasado' } });
    expect(atrasados).to.have.lengthOf.at.least(1);
    expect(atrasados[0].status).to.equal('atrasado');
  });

  it('Deve aceitar valor zero na mensalidade', async () => {
    const usuario = await db.Usuario.create({ login: 'valor_zero', nome: 'Valor Zero' });

    const mensalidade = await db.Mensalidade.create({
      id_usuario: usuario.id,
      valor: 0.00,
      ano_mes: '2024-09',
      status: 'pendente',
    });

    expect(parseFloat(mensalidade.valor)).to.equal(0.00);
  });

  it('Não deve aceitar valor negativo', async () => {
    const usuario = await db.Usuario.create({ login: 'valor_negativo', nome: 'Valor Negativo' });

    try {
      await db.Mensalidade.create({
        id_usuario: usuario.id,
        valor: -10.00,
        ano_mes: '2024-10',
        status: 'pendente',
      });
      expect.fail('Deveria lançar erro de validação para valor negativo');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
      expect(error.message).to.include('Validation min on valor failed');
    }
  });

  it('Deve criar mensalidade com status padrão "pendente" quando não informado', async () => {
    const usuario = await db.Usuario.create({ login: 'status_default', nome: 'Status Default' });

    const mensalidade = await db.Mensalidade.create({
      id_usuario: usuario.id,
      valor: 20.00,
      ano_mes: '2024-11',
    });

    expect(mensalidade.status).to.equal('pendente');
  });

  it('Deve obter o usuário associado a uma mensalidade', async () => {
    const usuario = await db.Usuario.create({ login: 'associacao_teste', nome: 'Associação Teste' });

    const mensalidade = await db.Mensalidade.create({
      id_usuario: usuario.id,
      valor: 60.00,
      ano_mes: '2024-12',
      status: 'pago',
    });

    const associado = await mensalidade.getUsuario();  // supondo que associação esteja definida
    expect(associado).to.be.not.null;
    expect(associado.login).to.equal('associacao_teste');
  });

});
